package com.vlearning.KLTN_final.domain.dto.request;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.UserCoupon;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SingleCheckoutReq {

    @NotNull(message = "Requires buyer")
    User buyer;

    @NotNull(message = "Requires course")
    Course course;

    UserCoupon userCoupon;
}
