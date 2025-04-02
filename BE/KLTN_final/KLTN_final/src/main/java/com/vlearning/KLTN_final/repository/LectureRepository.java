package com.vlearning.KLTN_final.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.Lecture;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {

}
