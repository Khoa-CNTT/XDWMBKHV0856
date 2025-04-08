package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlearning.KLTN_final.domain.Coupon;
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
        private OrderService orderService;

        @Autowired
        private UserCouponRepository userCouponRepository;

        @Autowired
        private ObjectMapper objectMapper;

        private boolean isFree(Integer i) {
                return i <= 0;
        }

        @Transactional
        public PayOSResponse createPaymentLink(MultipleCheckoutReq request) throws CustomException {
                try {

                        if (!this.userRepository.findById(request.getBuyer().getId()).isPresent()) {
                                throw new CustomException("User not found");
                        }

                        User user = this.userRepository.findById(request.getBuyer().getId()).get();

                        Integer finalAmount = 0;
                        Long lastCourseId = 0L;

                        List<Order> orders = new ArrayList<>();
                        List<ItemData> items = new ArrayList<>();
                        for (Course course : request.getCourses()) {
                                if (this.courseRepository.findById(course.getId()).isPresent()
                                                && !this.orderService.isUserBoughtCourse(user, course)
                                                && !this.orderService.isUserIsCourseOwner(user, course)) {
                                        course = this.courseRepository.findById(course.getId()).get();
                                        Integer price = course.getPrice().intValue();
                                        ItemData item = ItemData.builder()
                                                        .name(course.getTitle())
                                                        .price(price)
                                                        .quantity(1)
                                                        .build();
                                        items.add(item);
                                        finalAmount += item.getPrice();
                                        lastCourseId = course.getId();

                                        Order order = new Order();
                                        order.setBuyer(user);
                                        order.setCourse(course);
                                        orders.add(order);
                                }
                        }

                        if (items != null && items.size() > 0) {
                                Long orderCode = Long.valueOf(System.currentTimeMillis() + "" +
                                                user.getId() + lastCourseId);

                                orders.forEach(order -> order.setOrderCode(orderCode));
                                if (this.isFree(finalAmount)) {
                                        orders.forEach(order -> order.setStatus(OrderStatus.PAID));
                                        this.orderRepository.saveAll(orders);
                                        return null;
                                }
                                this.orderRepository.saveAll(orders);

                                PaymentData paymentData = PaymentData.builder()
                                                .orderCode(orderCode)
                                                .description("Thanh toan VLearning")
                                                .amount(2000)
                                                .items(items)
                                                .returnUrl("http://localhost:5173/payment/success")
                                                .cancelUrl("http://localhost:5173")
                                                .build();

                                CheckoutResponseData data = payOS.createPaymentLink(paymentData);

                                return new PayOSResponse(200, "Create link success", objectMapper.valueToTree(data));
                        } else {
                                throw new CustomException("Course not found or user bought it before");
                        }

                } catch (Exception e) {
                        return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
                }
        }

        @Transactional
        public PayOSResponse createPaymentLink(SingleCheckoutReq request) {
                try {

                        if (!this.userRepository.findById(request.getBuyer().getId()).isPresent()) {
                                throw new CustomException("User not found");
                        }

                        if (!this.courseRepository.findById(request.getCourse().getId()).isPresent()) {
                                throw new CustomException("Course not found");
                        }

                        User user = this.userRepository.findById(request.getBuyer().getId()).get();

                        Course course = this.courseRepository.findById(request.getCourse().getId()).get();

                        if (this.orderService.isUserBoughtCourse(user, course)) {
                                throw new CustomException("User bought it before");
                        }

                        if (this.orderService.isUserIsCourseOwner(user, course)) {
                                throw new CustomException("User is the course owner");
                        }

                        List<ItemData> items = new ArrayList<>();
                        ItemData item = ItemData.builder()
                                        .name(course.getTitle())
                                        .price(course.getPrice().intValue())
                                        .quantity(1)
                                        .build();
                        items.add(item);

                        Integer finalAmount = item.getPrice();

                        if (request.getUserCoupon() != null) {
                                if (this.userCouponRepository.findById(request.getUserCoupon().getId()).isPresent()) {

                                        UserCoupon userCoupon = this.userCouponRepository
                                                        .findById(request.getUserCoupon().getId()).get();

                                        if (userCoupon.getUser().getId() != user.getId()) {
                                                throw new CustomException("User can not use this coupon");
                                        }

                                        if (userCoupon.getExpiresAt().isBefore(Instant.now())) {
                                                throw new CustomException("Coupon has expired");
                                        }

                                        Coupon coupon = userCoupon.getCoupon();
                                        Integer discount = 0;
                                        if (coupon.getDiscountType().equals(DiscountType.FIXED)) {
                                                discount = coupon.getValue().intValue();
                                        } else if (coupon.getDiscountType().equals(DiscountType.PERCENT)) {
                                                Double percent = coupon.getValue();
                                                discount = (int) (finalAmount / 100 * percent);
                                        }
                                        finalAmount -= discount;

                                        ItemData itemCP = ItemData.builder()
                                                        .name(coupon.getHeadCode())
                                                        .price(-discount)
                                                        .quantity(1)
                                                        .build();
                                        items.add(itemCP);

                                        this.userCouponRepository.deleteById(userCoupon.getId());
                                }
                        }

                        Long orderCode = Long.valueOf(System.currentTimeMillis() + "" +
                                        user.getId() + course.getId());

                        Order order = new Order();
                        order.setBuyer(user);
                        order.setCourse(course);
                        order.setOrderCode(orderCode);
                        if (this.isFree(finalAmount)) {
                                order.setStatus(OrderStatus.PAID);
                                this.orderRepository.save(order);
                                return null;
                        }
                        this.orderRepository.save(order);

                        PaymentData paymentData = PaymentData.builder()
                                        .orderCode(orderCode)
                                        .description("Thanh toan VLearning")
                                        .amount(finalAmount)
                                        .items(items)
                                        .returnUrl("http://localhost:5173/payment/success")
                                        .cancelUrl("http://localhost:5173")
                                        .build();

                        CheckoutResponseData data = payOS.createPaymentLink(paymentData);

                        return new PayOSResponse(200, "Create link success", objectMapper.valueToTree(data));
                } catch (Exception e) {
                        return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
                }
        }
}
