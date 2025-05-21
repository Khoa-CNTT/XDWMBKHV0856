package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.Collections;
import java.util.HashSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.UserCoupon;
import com.vlearning.KLTN_final.domain.dto.request.MultipleCheckoutReq;
import com.vlearning.KLTN_final.domain.dto.request.SingleCheckoutReq;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.UserCouponRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.DiscountType;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;

@Service
public class PayOSService {

        @Autowired
        private PayOS payOS;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private UserCouponRepository userCouponRepository;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private CourseValidationService courseValidationService;

        private boolean isFree(Integer i) {
                return i <= 0;
        }

        @Transactional
        public PayOSResponse createPayment(MultipleCheckoutReq req) throws CustomException {
                try {
                        if (!this.userRepository.findById(req.getBuyer().getId()).isPresent()) {
                                throw new CustomException("User not found");
                        }

                        User user = this.userRepository.findById(req.getBuyer().getId()).get();

                        List<Course> courses = new ArrayList<>();
                        for (Course course : req.getCourses()) {
                                if (this.courseRepository.findById(course.getId()).isPresent()) {
                                        course = this.courseRepository.findById(course.getId()).get();
                                        if (this.courseValidationService.isCourseAvailable(course)
                                                        && !this.courseValidationService.isUserBoughtCourse(user,
                                                                        course)
                                                        && !this.courseValidationService.isUserTheCourseOwner(user,
                                                                        course)) {
                                                courses.add(course);
                                        } else {
                                                throw new CustomException(
                                                                "Course is not available or user bought it before or user is the course owner");
                                        }
                                } else {
                                        throw new CustomException("Course not found");
                                }
                        }

                        Long orderCode = Long.valueOf(System.currentTimeMillis() + "" +
                                        ThreadLocalRandom.current().nextLong(1L, 999L));
                        Integer amount = 0;

                        Set<Course> uniqueCourses = new HashSet<>(courses);
                        List<Order> orders = new ArrayList<>();
                        List<ItemData> items = new ArrayList<>();

                        for (Course course : uniqueCourses) {
                                Order order = new Order();
                                order.setBuyer(user);
                                order.setCourse(course);
                                order.setOrderCode(orderCode);
                                orders.add(order);

                                amount += course.getPrice();

                                ItemData itemData = ItemData.builder()
                                                .name(course.getTitle())
                                                .price(course.getPrice())
                                                .quantity(1)
                                                .build();
                                items.add(itemData);
                        }

                        if (!this.isFree(amount)) {
                                this.orderRepository.saveAll(orders);

                                PaymentData paymentData = PaymentData.builder()
                                                .orderCode(orderCode)
                                                .description("Thanh toan VLearning")
                                                .amount(amount)
                                                .items(items)
                                                .returnUrl("http://localhost:5173/payment/success")
                                                .cancelUrl("http://localhost:5173/payment/cancel")
                                                .build();

                                CheckoutResponseData data = payOS.createPaymentLink(paymentData);

                                return new PayOSResponse(200, "Create link success",
                                                objectMapper.valueToTree(data));
                        } else {
                                orders.forEach(o -> o.setStatus(OrderStatus.PAID));
                                this.orderRepository.saveAll(orders);

                                return new PayOSResponse(308, "Free",
                                                objectMapper.valueToTree(orders.get(0).getOrderCode()));
                        }
                } catch (Exception e) {
                        return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
                }
        }

        @Transactional
        public PayOSResponse createPayment(SingleCheckoutReq req) throws CustomException {
                try {
                        if (!this.userRepository.findById(req.getBuyer().getId()).isPresent()) {
                                throw new CustomException("User not found");
                        }

                        if (!this.courseRepository.findById(req.getCourse().getId()).isPresent()) {
                                throw new CustomException("Course not found");
                        }

                        User user = this.userRepository.findById(req.getBuyer().getId()).get();
                        Course course = this.courseRepository.findById(req.getCourse().getId()).get();

                        // course phai san sang hoac nguoi dung chua mua no, ....
                        if (this.courseValidationService.isCourseAvailable(course)
                                        && !this.courseValidationService.isUserBoughtCourse(user, course)
                                        && !this.courseValidationService.isUserTheCourseOwner(user, course)) {

                                Long orderCode = Long.valueOf(System.currentTimeMillis() + "" +
                                                ThreadLocalRandom.current().nextLong(1L, 999L));
                                Integer amount = course.getPrice();
                                List<ItemData> items = new ArrayList<>();

                                Order order = new Order();
                                order.setBuyer(user);
                                order.setCourse(course);
                                order.setOrderCode(orderCode);

                                // phai != null va ton tai
                                if (req.getUserCoupon() != null && this.userCouponRepository
                                                .findById(req.getUserCoupon().getId()).isPresent()) {

                                        UserCoupon uCoupon = this.userCouponRepository
                                                        .findById(req.getUserCoupon().getId()).get();

                                        if (uCoupon.getUser().equals(user)
                                                        && uCoupon.getExpiresAt().isAfter(Instant.now())) {
                                                Integer discount = 0;

                                                if (uCoupon.getCoupon().getDiscountType()
                                                                .equals(DiscountType.FIXED)) {
                                                        discount = uCoupon.getCoupon().getValue();

                                                } else if (uCoupon.getCoupon().getDiscountType()
                                                                .equals(DiscountType.PERCENT)) {
                                                        Integer percent = uCoupon.getCoupon().getValue();
                                                        discount = amount / 100 * percent;
                                                }

                                                if (!this.isFree(amount))
                                                        this.userCouponRepository.deleteById(uCoupon.getId());

                                                amount -= discount;

                                                ItemData itemCP = ItemData.builder()
                                                                .name(uCoupon.getCoupon().getHeadCode())
                                                                .price(-discount)
                                                                .quantity(1)
                                                                .build();
                                                items.add(itemCP);
                                        } else {
                                                throw new CustomException(
                                                                "User is not the coupon's owner or coupon has expired");
                                        }
                                }

                                if (!this.isFree(amount)) {
                                        this.orderRepository.save(order);
                                        ItemData item = ItemData.builder()
                                                        .name(course.getTitle())
                                                        .price(course.getPrice())
                                                        .quantity(1)
                                                        .build();
                                        items.add(item);
                                        Collections.reverse(items);

                                        PaymentData paymentData = PaymentData.builder()
                                                        .orderCode(orderCode)
                                                        .description("Thanh toan VLearning")
                                                        .amount(amount)
                                                        .items(items)
                                                        .returnUrl("http://localhost:5173/payment/success")
                                                        .cancelUrl("http://localhost:5173/payment/cancel")
                                                        .build();

                                        CheckoutResponseData data = payOS.createPaymentLink(paymentData);

                                        return new PayOSResponse(200, "Create link success",
                                                        objectMapper.valueToTree(data));
                                } else {
                                        order.setStatus(OrderStatus.PAID);
                                        this.orderRepository.save(order);

                                        return new PayOSResponse(308, "Free",
                                                        objectMapper.valueToTree(order.getOrderCode()));
                                }
                        } else {
                                throw new CustomException(
                                                "Course is not available or user bought course before or user is the course owner");
                        }
                } catch (Exception e) {
                        return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
                }
        }
}
