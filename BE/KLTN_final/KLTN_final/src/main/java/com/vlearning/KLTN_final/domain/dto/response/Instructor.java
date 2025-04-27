package com.vlearning.KLTN_final.domain.dto.response;

import com.vlearning.KLTN_final.domain.User;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class Instructor extends User {

    private Integer totalStudents;

    private Integer totalCourses;

    private Float totalRating;
}
