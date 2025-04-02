package com.vlearning.KLTN_final.domain.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateReviewReq {

    private Long id;

    @NotNull(message = "User can not be empty")
    private Long userId;

    @NotNull(message = "Rating can not be empty")
    @Min(value = 1, message = "Rating must be greater than or equal to 1")
    private Float rating;

    @NotBlank(message = "Comment can not be empty")
    private String comment;
}
