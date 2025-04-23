package com.vlearning.KLTN_final.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vlearning.KLTN_final.domain.LectureProcess;

@Repository
public interface LectureProcessRepository extends JpaRepository<LectureProcess, Long> {

    LectureProcess findByUserIdAndLectureId(Long uid, Long lid);

    List<LectureProcess> findAllByUserIdAndLectureChapterCourseId(Long uid, Long cid);
}
