package com.vlearning.KLTN_final.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.CouponService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/v1")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/coupon")
    public ResponseEntity<ResponseDTO<Coupon>> postMethodName(@RequestBody @Valid Coupon coupon)
            throws CustomException {
        ResponseDTO<Coupon> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create coupon success");
        res.setData(this.couponService.handleCreateCoupon(coupon));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

}
