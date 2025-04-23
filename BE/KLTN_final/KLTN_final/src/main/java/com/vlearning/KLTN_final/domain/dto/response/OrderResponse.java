package com.vlearning.KLTN_final.domain.dto.response;

import java.time.Instant;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.LectureProcess;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {

        Long id;

        @JsonIgnoreProperties(value = { "password", "role", "bio", "background", "address", "phone", "active",
                        "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "createdAt", "updatedAt" })
        private User buyer;

        @JsonIgnoreProperties(value = { "wishlists", "orders", "reviews" })
        private Course course;

        @Enumerated(EnumType.STRING)
        private OrderStatus status;

        private Long orderCode;

        private Integer income;

        private Integer userTotalProcess;

        @JsonIgnoreProperties(value = { "user", "course", "createdAt", "updatedAt" })
        private Review userReview;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
        private Instant createdAt;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
        private Instant updatedAt;

}
