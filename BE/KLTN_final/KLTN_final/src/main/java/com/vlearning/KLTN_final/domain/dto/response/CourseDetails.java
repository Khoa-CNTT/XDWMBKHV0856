package com.vlearning.KLTN_final.domain.dto.response;

import java.time.Instant;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.validator.Require;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseDetails {
    private long id;

    private String title;

    private String description;

    private String image;

    @JsonIgnoreProperties(value = { "password", "role", "background", "address",
            "phone", "active", "protect", "fields", "skills", "ownCourses", "orders", "reviews", "createdAt",
            "updatedAt" })
    @Require(message = "Requires owner")
    private User owner;

    private Integer price;

    private Integer totalChapter;

    private Integer totalLecture;

    @JsonIgnoreProperties(value = { "users", "courses", "createdAt", "updatedAt" })
    private List<Field> fields;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    private List<ChapterDetails> chapters;

    private List<Review> reviews;

    private Integer totalReviews;

    private Integer totalRating;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChapterDetails {
        private long id;

        private String title;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
        private Instant createdAt;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
        private Instant updatedAt;

        private List<LectureDetails> lectures;

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class LectureDetails {
            private long id;

            private String title;

            private String file;

            @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
            private Instant createdAt;

            @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
            private Instant updatedAt;
        }
    }
}
