package com.vlearning.KLTN_final.domain.dto.request;

import java.util.List;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
@AllArgsConstructor
@NoArgsConstructor
public class MultipleCheckoutReq {

    @NotNull(message = "Requires buyer")
    User buyer;

    @NotNull(message = "Requires course")
    @NotEmpty(message = "Courses list must not be empty")
    List<Course> courses;
}
