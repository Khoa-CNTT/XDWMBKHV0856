package com.vlearning.KLTN_final.domain.dto.response;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.validator.Require;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {

    Long id;

    @JsonIgnoreProperties(value = { "email", "password", "role", "fullName", "bio", "avatar", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "createdAt",
            "updatedAt" })
    private User buyer;

    @JsonIgnoreProperties(value = { "owner", "description", "price", "status",
            "fields", "skills", "active", "reviews", "createdAt", "updatedAt" })
    private Course course;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Long orderCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    private Integer userProcess;
}
