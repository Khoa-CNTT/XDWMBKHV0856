package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vlearning.KLTN_final.domain.dto.request.PayOSRequest;
import com.vlearning.KLTN_final.domain.dto.request.PayOSWebhookRequest;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.PayOSService;

import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

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
    private PayOS payOS;

    @PostMapping("/payos/checkout")
    public ResponseEntity<ResponseDTO<PayOSResponse>> PayOSCheckout(@RequestBody PayOSRequest request)
            throws Exception {

        ResponseDTO<PayOSResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Checkout created");
        res.setData(this.payOSService.createPaymentLink(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/payos/transfer_handler")
    public void payosTransferHandler(@RequestBody(required = false) PayOSWebhookRequest request)
            throws JsonProcessingException, IllegalArgumentException {

        System.out.println(request.toString());
        System.out.println(request.getData().toString());
    }

}
