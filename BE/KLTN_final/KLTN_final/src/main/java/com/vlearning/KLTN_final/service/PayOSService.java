package com.vlearning.KLTN_final.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.PayOSRequest;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
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
        private ObjectMapper objectMapper;

        @Transactional
        public PayOSResponse createPaymentLink(PayOSRequest request) throws CustomException {
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
                                                && !this.orderService.isUserBoughtCourse(user, course)) {
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

                                PaymentData paymentData = PaymentData.builder()
                                                .orderCode(orderCode)
                                                .description("Thanh toan VLearning")
                                                .amount(2000)
                                                .items(items)
                                                .returnUrl("http://localhost:5173/payment/success")
                                                .cancelUrl("http://localhost:5173")
                                                .build();

                                orders.forEach(order -> order.setOrderCode(paymentData.getOrderCode()));
                                this.orderRepository.saveAll(orders);

                                CheckoutResponseData data = payOS.createPaymentLink(paymentData);

                                return new PayOSResponse(200, "Create link success", objectMapper.valueToTree(data));
                        } else {
                                throw new CustomException("Course not found or user bought it before");
                        }

                } catch (Exception e) {
                        return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
                }
        }
}
