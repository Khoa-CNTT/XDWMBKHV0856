package com.vlearning.KLTN_final.domain.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserSkills {
    @NotNull(message = "Requires user")
    @JsonIgnoreProperties(value = { "password", "role", "background", "address", "phone", "active", "protect", "fields",
            "skills", "wishlist", "ownCourses", "orders", "reviews", "createdAt", "updatedAt" })
    User user;

    @NotNull
    @JsonIgnoreProperties(value = { "field" })
    List<Skill> skills;
}
