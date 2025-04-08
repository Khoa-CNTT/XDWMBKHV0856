package com.vlearning.KLTN_final.domain.dto.request;

import java.util.List;

import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.User;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReleaseCouponReq {
    @NotNull(message = "Coupon can not be null")
    Coupon coupon;

    @NotNull(message = "Users can not be null")
    List<User> users;
}
