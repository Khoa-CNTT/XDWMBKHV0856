package com.vlearning.KLTN_final.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.LectureProcess;
import com.vlearning.KLTN_final.domain.User;

@Repository
public interface LectureProcessRepository extends JpaRepository<LectureProcess, Long> {

    LectureProcess findByUserIdAndLectureId(Long uid, Long lid);

    Optional<LectureProcess> findByUserAndLecture(User user, Lecture lecture);

    List<LectureProcess> findAllByUserIdAndLectureChapterCourseId(Long uid, Long cid);
}
