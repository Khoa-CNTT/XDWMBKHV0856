package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vlearning.KLTN_final.domain.dto.response.CreateMomoResponse;
import com.vlearning.KLTN_final.service.MomoService;
import com.vlearning.KLTN_final.util.constant.MomoParameter;
import com.vlearning.KLTN_final.util.exception.CustomException;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/momo")
public class MomoController {

    @Autowired
    private MomoService momoService;

    @PostMapping("/create")
    public CreateMomoResponse createQR() throws CustomException {
        // TODO: process POST request

        return momoService.createQR();
    }

    @GetMapping("/ipn-handler")
    public String ipnHandler(@RequestParam Map<String, String> param) {
        Integer resultCode = Integer.valueOf(param.get(MomoParameter.RESULT_CODE));
        return resultCode == 0 ? "Giao dich thanh cong" : "That bai";
    }

}
