package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.dto.request.PayOSRequest;
import com.vlearning.KLTN_final.domain.dto.request.PayOSWebhookRequest;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.service.PayOSService;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/v1")
public class PayOSController {

    @Autowired
    private PayOSService payOSService;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/payos/checkout")
    public ResponseEntity<ResponseDTO<PayOSResponse>> PayOSCheckout(@RequestBody PayOSRequest request)
            throws CustomException {

        ResponseDTO<PayOSResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Checkout created");
        res.setData(this.payOSService.createPaymentLink(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/payos/transfer_handler")
    public void payosTransferHandler(@RequestBody(required = false) PayOSWebhookRequest request) {

        List<Order> orders = this.orderRepository.findAllByOrderCode(request.getData().getOrderCode());
        if (request.getData().getCode().equals("00")) {
            orders.forEach(order -> order.setStatus(OrderStatus.PAID));
            this.orderRepository.saveAll(orders);
        } else {
            this.orderRepository.deleteAll(orders);
        }

    }

}
