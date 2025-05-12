package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vlearning.KLTN_final.domain.Chapter;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.CreateSeveralOrdersReq;
import com.vlearning.KLTN_final.domain.dto.response.LectureUserProcess;
import com.vlearning.KLTN_final.domain.dto.response.OrderResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.LectureProcessRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.ReviewRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
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

    // @Autowired
    // private CourseService courseService;

    @Autowired
    private PayOS payOS;

    @Autowired
    private LectureProcessRepository lectureProcessRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CourseValidationService courseValidationService;

    @Autowired
    private WishlistService wishlistService;

    private OrderResponse convertToOrderResponse(Order order) throws CustomException {
        OrderResponse res = OrderResponse.builder()
                .id(order.getId())
                .buyer(order.getBuyer())
                .course(Course.builder()
                        .id(order.getCourse().getId())
                        .owner(order.getCourse().getOwner())
                        .build())
                .status(order.getStatus())
                .orderCode(order.getOrderCode())
                .income(order.getIncome())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .userTotalProcess(null)
                .userReview(null)
                .build();

        if (order.getStatus().equals(OrderStatus.PAID)) {
            // xu ly process
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

            // xu ly course
            Course course = order.getCourse();
            for (Chapter chapter : course.getChapters()) {
                List<Lecture> lectureProcess = new ArrayList<>();
                for (Lecture lecture : chapter.getLectures()) {
                    LectureUserProcess lUserProcess = LectureUserProcess.builder()
                            .id(lecture.getId())
                            .title(lecture.getTitle())
                            .description(lecture.getDescription())
                            .file(lecture.getFile())
                            .preview(lecture.getPreview())
                            .chapter(lecture.getChapter())
                            .createdAt(lecture.getCreatedAt())
                            .updatedAt(lecture.getUpdatedAt())
                            .lecturesProcess(lecture.getLecturesProcess())
                            .build();

                    // Gán LectureProcess nếu có
                    this.lectureProcessRepository.findByUserAndLecture(order.getBuyer(), lecture)
                            .ifPresent(lUserProcess::setLectureProcess);

                    lectureProcess.add(lUserProcess);
                }
                chapter.setLectures(lectureProcess);
            }

            res.setCourse(course);
            res.setUserTotalProcess((int) Math.round(100.0 / countLecture * countDoneLecture));
            // res.setUserProcesses(this.lectureProcessRepository
            // .findAllByUserIdAndLectureChapterCourseId(order.getBuyer().getId(),
            // order.getCourse().getId()));
            res.setUserReview(this.reviewRepository.findByUserAndCourse(order.getBuyer(), order.getCourse()));
        }

        return res;
    }

    @Transactional
    public List<Order> handleCreateSeveralOrders(CreateSeveralOrdersReq req) throws Exception {

        if (!this.userRepository.findById(req.getBuyer().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(req.getBuyer().getId()).get();
        List<Order> orders = new ArrayList<>();
        for (Course course : req.getCourses()) {
            if (this.courseRepository.findById(course.getId()).isPresent()) {
                if (!this.courseValidationService.isUserBoughtCourse(user, course)
                        && this.courseValidationService.isCourseAvailable(course)
                        && !this.courseValidationService.isUserTheCourseOwner(user, course)) {
                    Order order = new Order();
                    order.setBuyer(user);
                    order.setCourse(course);
                    this.orderRepository.save(order);
                    order.setStatus(OrderStatus.PAID);
                    orders.add(order);

                    // remove out wishlist
                    this.wishlistService.handleRemoveCourseFromWishlist(user.getWishlist().getId(),
                            course.getId());
                }
            }
        }

        if (orders != null && orders.size() > 0) {
            Long orderCode = Long.valueOf(System.currentTimeMillis() + "" +
                    ThreadLocalRandom.current().nextLong(1L, 999L));

            // xoa order pending
            for (Order order : orders) {
                order.setOrderCode(orderCode);
                this.handleDeletePendingOrderByBuyerIdAndCourseIdExceptOrderCode(
                        order.getBuyer().getId(),
                        order.getCourse().getId(),
                        order.getOrderCode());
            }

            return this.orderRepository.saveAll(orders);
        } else {
            throw new CustomException("Course not found or user bought it before or course is not available");
        }
    }

    public OrderResponse handleFetchOrder(Long id) throws CustomException {
        if (!this.orderRepository.findById(id).isPresent()) {
            throw new CustomException("Order not found");
        }

        return this.convertToOrderResponse(this.orderRepository.findById(id).get());
    }

    public OrderResponse handleFetchOrderByBuyerIdAndCourseId(Long uid, Long cid) throws CustomException {
        if (!this.userRepository.findById(uid).isPresent()) {
            throw new CustomException("User not found");
        }

        if (!this.courseRepository.findById(cid).isPresent()) {
            throw new CustomException("Course not found");
        }

        Order order = this.orderRepository.findByStatusAndBuyerIdAndCourseId(OrderStatus.PAID, uid, cid);

        if (order == null) {
            throw new CustomException("Order not found");
        }

        return this.convertToOrderResponse(order);
    }

    public ResultPagination handleFetchSeveralOrders(Specification<Order> spec, Pageable pageable) {

        // Lấy dữ liệu từ repository với phân trang
        Page<Order> orderPage = this.orderRepository.findAll(spec, pageable);

        List<OrderResponse> orderResponses = orderPage
                .stream()
                .map(t -> {
                    try {
                        return convertToOrderResponse(t);
                    } catch (CustomException e) {
                        e.printStackTrace();
                    }
                    return null;
                })
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

    public void handleDeletePendingOrderByBuyerIdAndCourseIdExceptOrderCode(Long uid, Long cid, Long orderCode)
            throws Exception {
        List<Order> orders = this.orderRepository.findAllByStatusAndBuyerIdAndCourseId(OrderStatus.PENDING, uid, cid);
        if (orders != null)
            for (Order order : orders) {
                if (order.getOrderCode() != orderCode) {
                    // xóa order pending trước đó
                    this.orderRepository.deleteById(order.getId());

                    // xóa payos order
                    if (order.getOrderCode() != null)
                        this.cancelPayOSOrder(order.getOrderCode());
                }
            }
    }

    @Scheduled(cron = "0 0/5 * * * ?")
    @Async
    public void autoRemoveExpirePendingOrder() throws Exception {
        List<Order> orders = this.orderRepository.findAllByStatus(OrderStatus.PENDING);
        Instant now = Instant.now();
        for (Order order : orders) {
            // hết hạn sau 10 phut
            Instant expireTime = order.getCreatedAt().plusSeconds(600);
            if (expireTime.isBefore(now)) {
                this.orderRepository.deleteById(order.getId());
                if (order.getOrderCode() != null)
                    this.cancelPayOSOrder(order.getOrderCode());
            }

        }

        System.out.println(">>>>>>>>>>>>>> DELETE ALL EXPIRED PENDING ORDERS SUCCESS: " + LocalDateTime.now());
    }

    public void cancelPayOSOrder(Long orderCode) throws Exception {
        if (this.isPayOSOrderExist(orderCode))
            payOS.cancelPaymentLink(orderCode, null);
    }

    public boolean isPayOSOrderExist(Long orderCode) {
        try {
            payOS.getPaymentLinkInformation(orderCode);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}