package com.vlearning.KLTN_final.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.vlearning.KLTN_final.domain.dto.request.StripeRequest;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.StripeResponse;
import com.vlearning.KLTN_final.service.CourseService;
import com.vlearning.KLTN_final.service.StripeService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

@RestController
@RequestMapping("/v1")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private CourseService courseService;

    @Value("${stripe.endpointSecret}")
    private String endpointSecret;

    @PostMapping("/stripe/checkout")
    public ResponseEntity<ResponseDTO<StripeResponse>> checkoutProduct(@RequestBody @Valid StripeRequest productRequest)
            throws CustomException {

        ResponseDTO<StripeResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Payment create success");
        res.setData(stripeService.checkoutProducts(productRequest));

        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook2(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) throws CustomException {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Invalid signature");
        }
        // Handle the event
        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getData().getObject();

            // Lấy metadata từ session
            // Long courseId = Long.parseLong(session.getMetadata().get("courseId"));
            Long userId = Long.parseLong(session.getMetadata().get("userId"));
            // System.out.println(">>>>>>>>>>>>>>>>>>" + courseId + "," + userId);

            // this.courseService.handlePurchaseCourse(userId, productId);
        }
        return ResponseEntity.ok().build();
    }

}
