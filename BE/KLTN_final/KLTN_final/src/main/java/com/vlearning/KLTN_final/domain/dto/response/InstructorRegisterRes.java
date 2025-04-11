package com.vlearning.KLTN_final.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wallet;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InstructorRegisterRes {

    @JsonIgnoreProperties(value = { "avatar", "password", "background", "active", "protect", "fields", "skills",
            "wishlist", "ownCourses", "orders", "reviews", "createdAt", "updatedAt" })
    User user;

    @JsonIgnoreProperties(value = { "user" })
    Wallet wallet;

}
