package com.vlearning.KLTN_final.domain.dto.request;

import java.util.List;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.validator.Require;

import lombok.Data;

@Data
public class CreateSeveralOrdersReq {

    // @NotNull(message = "Order's price can not be empty")
    // @Min(value = 0, message = "Order's price must be greater than or equal to 0")
    // private Double totalPrice;

    @Require(message = "Requires user")
    private User buyer;

    List<Course> courses;
}
