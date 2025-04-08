package com.vlearning.KLTN_final.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.UserCoupon;
import com.vlearning.KLTN_final.domain.dto.request.ReleaseCouponReq;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.CouponService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/v1")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/coupon")
    public ResponseEntity<ResponseDTO<Coupon>> createCoupon(@RequestBody @Valid Coupon coupon)
            throws CustomException {
        ResponseDTO<Coupon> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create coupon success");
        res.setData(this.couponService.handleCreateCoupon(coupon));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/coupon/{id}")
    public ResponseEntity<ResponseDTO<Coupon>> fetchCoupon(@PathVariable Long id)
            throws CustomException {

        ResponseDTO<Coupon> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch coupon success");
        res.setData(this.couponService.handleFetchCoupon(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/coupons")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralCoupons(@Filter Specification<Coupon> spec,
            Pageable pageable)
            throws CustomException {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch several coupons success");
        res.setData(this.couponService.handleFetchSeveralCoupons(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/coupon/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteCoupon(@PathVariable Long id)
            throws CustomException {

        this.couponService.handleDeleteCoupon(id);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Delete coupons success");

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/coupon")
    public ResponseEntity<ResponseDTO<Coupon>> updateCoupon(@RequestBody Coupon coupon)
            throws CustomException {

        ResponseDTO<Coupon> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update coupons success");
        res.setData(this.couponService.handleUpdateCoupon(coupon));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PostMapping("/release-coupon")
    public ResponseEntity<ResponseDTO<Object>> releaseCoupon(@RequestBody ReleaseCouponReq req)
            throws CustomException {

        this.couponService.handleReleaseCoupon(req);
        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Release coupon success");

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/user-coupon/{id}")
    public ResponseEntity<ResponseDTO<List<UserCoupon>>> fetchCouponsUserOwning(@PathVariable Long id)
            throws CustomException {

        ResponseDTO<List<UserCoupon>> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch coupons user is owning success");
        res.setData(this.couponService.handleFetchUserCouponByUserId(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

}
