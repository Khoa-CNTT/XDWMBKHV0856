package com.vlearning.KLTN_final.domain.dto.request;

import java.util.List;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
public class PayOSRequest {

    @NotNull(message = "Requires buyer")
    User buyer;

    @NotNull(message = "Requires course")
    List<Course> courses;
}
