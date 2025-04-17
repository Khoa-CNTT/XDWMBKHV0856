package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Chapter;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.CreateSeveralOrdersReq;
import com.vlearning.KLTN_final.domain.dto.response.CourseResponse;
import com.vlearning.KLTN_final.domain.dto.response.OrderResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.LectureProcessRepository;
import com.vlearning.KLTN_final.repository.LectureRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;

import vn.payos.PayOS;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PayOS payOS;

    @Autowired
    private LectureProcessRepository lectureProcessRepository;

    private OrderResponse convertTOrderResponse(Order order) {

        OrderResponse res = OrderResponse.builder()
                .id(order.getId())
                .buyer(order.getBuyer())
                .course(order.getCourse())
                .status(order.getStatus())
                .orderCode(order.getOrderCode())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .userProcess(0)
                .build();

        if (order.getStatus().equals(OrderStatus.PAID)) {
            Integer countLecture = 0;
            Integer countDoneLecture = 0;
            if (order.getCourse().getChapters() != null && order.getCourse().getChapters().size() > 0)
                for (Chapter chapter : order.getCourse().getChapters()) {
                    if (chapter.getLectures() != null && chapter.getLectures().size() > 0) {
                        countLecture += chapter.getLectures().size();

                        for (Lecture lecture : chapter.getLectures()) {
                            if (lectureProcessRepository.findByUserIdAndLectureId(order.getBuyer().getId(),
                                    lecture.getId()) != null) {
                                countDoneLecture++;
                            }
                        }
                    }
                }

            res.setUserProcess((int) Math.round(100.0 / countLecture * countDoneLecture));
        }

        return res;
    }

    public List<Order> handleCreateSeveralOrders(CreateSeveralOrdersReq req) throws CustomException {

        if (!this.userRepository.findById(req.getBuyer().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(req.getBuyer().getId()).get();
        List<Order> orders = new ArrayList<>();
        for (Course course : req.getCourses()) {
            if (this.courseRepository.findById(course.getId()).isPresent()) {
                if (!this.isUserBoughtCourse(user, course) && this.isCourseAvailable(course)
                        && !this.isUserTheCourseOwner(user, course)) {
                    Order order = new Order();
                    order.setBuyer(user);
                    order.setCourse(course);
                    this.orderRepository.save(order);
                    order.setStatus(OrderStatus.PAID);
                    orders.add(order);
                }
            }
        }

        if (orders != null && orders.size() > 0) {
            return this.orderRepository.saveAll(orders);
        } else {
            throw new CustomException("Course not found or user bought it before or course is not available");
        }
    }

    public OrderResponse handleFetchOrder(Long id) throws CustomException {
        if (!this.orderRepository.findById(id).isPresent()) {
            throw new CustomException("Order not found");
        }

        return this.convertTOrderResponse(this.orderRepository.findById(id).get());
    }

    public ResultPagination handleFetchSeveralOrders(Specification<Order> spec, Pageable pageable) {

        // Lấy dữ liệu từ repository với phân trang
        Page<Order> orderPage = this.orderRepository.findAll(spec, pageable);

        // Chuyển đổi Course sang CourseResponse
        List<OrderResponse> orderResponses = orderPage
                .stream()
                .map(this::convertTOrderResponse)
                .toList();

        // Tạo lại Page từ danh sách response
        Page<OrderResponse> page = new PageImpl<>(orderResponses, pageable, orderPage.getTotalElements());

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

    public boolean isUserTheCourseOwner(User user, Course course) {
        user = this.userRepository.findById(user.getId()).get();
        course = this.courseRepository.findById(course.getId()).get();
        if (course.getOwner().getId() == user.getId()) {
            return true;
        }

        return false;
    }

    public boolean isCourseAvailable(Course course) {
        course = this.courseRepository.findById(course.getId()).get();
        if (course.getStatus().equals(CourseApproveEnum.APPROVED) && course.isActive()) {
            return true;
        }

        return false;
    }

    @Scheduled(cron = "0 0/10 * * * ?")
    @Async
    public void autoRemoveExpirePendingOrder() throws Exception {
        List<Order> orders = this.orderRepository.findAllByStatus(OrderStatus.PENDING);
        Instant now = Instant.now();
        for (Order order : orders) {
            // hết hạn sau 10 phut
            Instant expireTime = order.getCreatedAt().plusSeconds(600);
            if (expireTime.isBefore(now)) {
                this.orderRepository.deleteById(order.getId());
                payOS.cancelPaymentLink(order.getOrderCode(), null);
            }

        }

        System.out.println(">>>>>>>>>>>>>> DELETE ALL EXPIRED PENDING ORDERS SUCCESS: " + LocalDateTime.now());
    }
}
