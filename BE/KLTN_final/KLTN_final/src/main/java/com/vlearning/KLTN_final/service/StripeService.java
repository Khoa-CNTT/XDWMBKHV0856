package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.StripeRequest;
import com.vlearning.KLTN_final.domain.dto.response.StripeResponse;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class StripeService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Value("${stripe.secretKey}")
        private String stripeSecretKey;

        public StripeResponse checkoutProducts(StripeRequest productRequest) throws CustomException {
                Stripe.apiKey = stripeSecretKey;

                User user = this.userRepository.findById(productRequest.getUserId()).isPresent()
                                ? this.userRepository.findById(productRequest.getUserId()).get()
                                : null;

                if (user != null) {
                        SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData
                                        .builder()
                                        .setName(this.createBillTitle(productRequest.getCourses()))
                                        .build();

                        // Create new line item with the above product data and associated price
                        SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData
                                        .builder()
                                        .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency()
                                                        : "VND")
                                        .setUnitAmount(productRequest.getPrice())
                                        .setProductData(productData)
                                        .build();

                        // Create new line item with the above price data
                        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                                        .setQuantity(Long.valueOf(productRequest.getCourses().length))
                                        .setPriceData(priceData)
                                        .build();

                        SessionCreateParams params = SessionCreateParams.builder()
                                        .setMode(SessionCreateParams.Mode.PAYMENT)
                                        .setSuccessUrl("http://localhost:5173/payment/success")
                                        .setCancelUrl("http://localhost:5173/payment/cancel")
                                        .addLineItem(lineItem)
                                        .putMetadata("courseId", "")
                                        .putMetadata("userId", user.getId() + "")
                                        .build();

                        Session session = null;

                        try {
                                session = Session.create(params);
                        } catch (StripeException e) {
                                return StripeResponse.builder()
                                                .status("Payment failed")
                                                .message(e.getMessage())
                                                .sessionId(null)
                                                .sessionUrl(null)
                                                .build();
                        }

                        return StripeResponse.builder()
                                        .status("Success")
                                        .message("Payment session created")
                                        .sessionId(session.getId())
                                        .sessionUrl(session.getUrl())
                                        .build();
                } else {
                        throw new CustomException("User not found");
                }

        }

        private String createBillTitle(Long[] courses) throws CustomException {
                String title = "";
                for (Long id : courses) {
                        if (this.courseRepository.findById(id).isPresent()) {
                                Course course = this.courseRepository.findById(id).get();
                                String s = course.getTitle() + ", ";
                                title += s;
                        } else {
                                throw new CustomException("Course not found");
                        }
                }

                return title.replaceFirst(", $", "");
        }

        // private Long createBillQuantity(Long[] courses) throws CustomException {
        // Long count;

        // for (Long i : courses) {

        // }

        // return title;
        // }
}
