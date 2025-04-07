package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.CreateSeveralOrdersReq;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public Order handleCreateOrder(Order order) throws CustomException {

        if (!this.userRepository.findById(order.getBuyer().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        if (!this.courseRepository.findById(order.getCourse().getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        User user = this.userRepository.findById(order.getBuyer().getId()).get();
        if (user.getOrders() != null && user.getOrders().size() > 0) {
            for (Order orderInArray : user.getOrders()) {
                if (orderInArray.getCourse().getId() == order.getCourse().getId())
                    throw new CustomException("Course has been buy by user before");
            }
        }

        return this.orderRepository.save(order);
    }

    public List<Order> handleCreateSeveralOrders(CreateSeveralOrdersReq req) throws CustomException {

        if (!this.userRepository.findById(req.getBuyer().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(req.getBuyer().getId()).get();
        List<Order> orders = new ArrayList<>();
        for (Long i : req.getCourses()) {
            if (!this.courseRepository.findById(i).isPresent()) {
                throw new CustomException("Course not found");
            } else {
                Order order = new Order();
                // order.setTotalPrice(req.getTotalPrice());
                order.setBuyer(user);
                order.setCourse(this.courseRepository.findById(i).get());
                orders.add(order);
            }
        }

        if (user.getOrders() != null && user.getOrders().size() > 0) {
            for (Order orderI : user.getOrders()) {
                for (Order orderJ : orders) {
                    if (orderI.getCourse().getId() == orderJ.getCourse().getId())
                        throw new CustomException("Course has been buy by user before");
                }
            }
        }

        return this.orderRepository.saveAll(orders);
    }

    public Order handleFetchOrder(Long id) throws CustomException {
        if (!this.orderRepository.findById(id).isPresent()) {
            throw new CustomException("Order not found");
        }

        return this.orderRepository.findById(id).get();
    }

    public ResultPagination handleFetchSeveralOrders(Specification<Order> spec, Pageable pageable) {

        Page<Order> page = this.orderRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(page.getContent());
        resultPagination.setMeta(meta);

        return resultPagination;
    }

    public boolean isUserBoughtCourse(User user, Course course) {

        user = this.userRepository.findById(user.getId()).get();
        List<Order> orders = this.orderRepository.findAllByBuyer(user);
        if (orders != null && orders.size() > 0) {
            for (Order order : orders) {
                if (order.getCourse().getId() == course.getId() && order.getStatus().equals(OrderStatus.PAID))
                    return true;
            }
        }
        return false;
    }

    @Scheduled(cron = "0 0/10 * * * ?")
    @Async
    public void autoRemoveExpirePendingOrder() {
        List<Order> orders = this.orderRepository.findAllByStatus(OrderStatus.PENDING);
        Instant now = Instant.now();
        for (Order order : orders) {
            // hết hạn sau 10 phut
            Instant expireTime = order.getCreatedAt().plusSeconds(600);
            if (expireTime.isBefore(now))
                this.orderRepository.deleteById(order.getId());
        }

        System.out.println(">>>>>>>>>>>>>> REMOVE ALL EXPIRE PENDING ORDERS" + LocalDateTime.now());
    }
}
