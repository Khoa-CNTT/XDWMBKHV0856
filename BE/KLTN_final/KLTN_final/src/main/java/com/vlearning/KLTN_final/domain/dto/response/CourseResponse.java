package com.vlearning.KLTN_final.domain.dto.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {

    Long id;

    String title;

    String description;

    String image;

    @JsonIgnoreProperties(value = { "password", "role", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "reviews",
            "createdAt", "updatedAt" })
    User owner;

    Integer price;

    Integer totalRating;

    Float overallRating;

    Integer studentQuantity;

    @JsonIgnoreProperties(value = { "skills", "users", "courses", "createdAt", "updatedAt" })
    List<Field> fields;

    @JsonIgnoreProperties(value = { "field", "users", "courses", "createdAt", "updatedAt" })
    List<Skill> skills;

    Boolean active;

    CourseApproveEnum status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;
}
