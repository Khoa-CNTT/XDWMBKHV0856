package com.vlearning.KLTN_final.domain.dto.request;

import java.util.List;

import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.validator.Require;

import jakarta.validation.constraints.Min;
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

    @NotBlank(message = "Short introduce can not be blank")
    private String shortIntroduce;

    @NotBlank(message = "Description can not be blank")
    private String description;

    private String image;

    @Require(message = "Requires owner")
    private User owner;

    @NotNull(message = "Course's price can not be empty")
    @Min(value = 0, message = "Course's price must be greater than or equal to 0")
    private Integer price;

    private List<Field> fields;

    private List<Skill> skills;

}
