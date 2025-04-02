package com.vlearning.KLTN_final.domain.dto.request;

import java.util.List;

import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.validator.Require;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseReq {

    Long id;

    @NotBlank(message = "Course's title can not be blank")
    private String title;

    @NotBlank(message = "Description can not be blank")
    private String description;

    private String image;

    @Require(message = "Requires owner")
    private User owner;

    @NotNull(message = "Course's price can not be empty")
    private Double price;

    private List<Field> fields;

    private List<Skill> skills;

}
