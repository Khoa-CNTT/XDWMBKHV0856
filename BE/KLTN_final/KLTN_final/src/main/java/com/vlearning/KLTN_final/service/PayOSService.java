package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlearning.KLTN_final.domain.dto.request.PayOSRequest;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;

import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;

@Service
public class PayOSService {

    @Autowired
    private PayOS payOS;

    public PayOSResponse createPaymentLink(PayOSRequest request) throws Exception {
        try {
            Long time = System.currentTimeMillis();
            Integer amount = (int) Double.parseDouble(request.getAmount() + "");

            ItemData item = ItemData.builder()
                    .name("test kh")
                    .price(amount)
                    .quantity(1)
                    .build();

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(time)
                    .description(request.getDescription())
                    .amount(amount)
                    .item(item)
                    .returnUrl("https://www.google.com/")
                    .cancelUrl("https://www.google.com/")
                    .build();

            CheckoutResponseData data = payOS.createPaymentLink(paymentData);

            ObjectMapper objectMapper = new ObjectMapper();

            return new PayOSResponse(200, "Create link success", objectMapper.valueToTree(data));
        } catch (Exception e) {
            return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
        }
    }
}
