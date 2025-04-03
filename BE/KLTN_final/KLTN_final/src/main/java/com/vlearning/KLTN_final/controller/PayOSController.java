package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vlearning.KLTN_final.domain.dto.request.PayOSRequest;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.PayOSService;

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

    @PostMapping("/payos/checkout")
    public ResponseEntity<ResponseDTO<PayOSResponse>> PayOSCheckout(@RequestBody PayOSRequest request)
            throws Exception {

        ResponseDTO<PayOSResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Checkout created");
        res.setData(this.payOSService.createPaymentLink(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

}
