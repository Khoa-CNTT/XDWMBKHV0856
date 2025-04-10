package com.vlearning.KLTN_final.domain.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.User;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserFields {

    @NotNull(message = "Requires user")
    @JsonIgnoreProperties(value = { "email", "fullName", "bio", "avatar", "password", "role", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "reviews",
            "createdAt", "updatedAt" })
    User user;

    @NotNull
    @JsonIgnoreProperties(value = { "skills" })
    List<Field> fields;
}
