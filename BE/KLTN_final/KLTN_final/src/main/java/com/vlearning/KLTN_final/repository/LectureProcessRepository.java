package com.vlearning.KLTN_final.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vlearning.KLTN_final.domain.LectureProcess;

@Repository
public interface LectureProcessRepository extends JpaRepository<LectureProcess, Long> {

    LectureProcess findByUserIdAndLectureId(Long uid, Long lid);
}
