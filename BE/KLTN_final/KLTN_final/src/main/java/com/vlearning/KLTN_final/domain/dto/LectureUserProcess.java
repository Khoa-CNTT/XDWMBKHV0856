package com.vlearning.KLTN_final.domain.dto;

import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.LectureProcess;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class LectureUserProcess extends Lecture {

    LectureProcess lectureProcess;
}
