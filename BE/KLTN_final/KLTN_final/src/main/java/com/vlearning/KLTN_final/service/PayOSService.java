package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public PayOSResponse createPaymentLink(PayOSRequest request) throws Exception {
        try {
            Long code = System.currentTimeMillis();
            Integer amount = (int) Double.parseDouble(request.getAmount() + "");

            ItemData item = ItemData.builder()
                    .name("test kh")
                    .price(amount)
                    .quantity(1)
                    .build();

            ItemData item2 = ItemData.builder()
                    .name("test 2")
                    .price(2000)
                    .quantity(1)
                    .build();

            List<ItemData> items = new ArrayList<>();
            items.add(item);
            items.add(item2);

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(code)
                    .description(request.getDescription())
                    .amount(amount)
                    .items(items)
                    .returnUrl("http://localhost:3000/payment/success")
                    .cancelUrl("http://localhost:3000/payment/cancel")
                    .build();

            CheckoutResponseData data = payOS.createPaymentLink(paymentData);

            return new PayOSResponse(200, "Create link success", objectMapper.valueToTree(data));
        } catch (Exception e) {
            return new PayOSResponse(500, "Create link failed: " + e.getMessage(), null);
        }
    }
}
