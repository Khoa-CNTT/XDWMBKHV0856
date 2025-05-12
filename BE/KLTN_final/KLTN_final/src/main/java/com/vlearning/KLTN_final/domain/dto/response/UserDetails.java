package com.vlearning.KLTN_final.domain.dto.response;

import java.util.List;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class UserDetails extends User {

    private Integer totalStudents;

    private Integer totalCourses;

    private Float totalRating;

    private List<Course> boughtCourses;
}
