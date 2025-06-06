package com.vlearning.KLTN_final.service;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vlearning.KLTN_final.domain.Chapter;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.LectureProcess;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.repository.ChapterRepository;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.LectureProcessRepository;
import com.vlearning.KLTN_final.repository.LectureRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.transaction.Transactional;

@Service
public class LectureService {

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private LectureProcessRepository lectureProcessRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseValidationService courseValidationService;

    @Autowired
    private CourseRepository courseRepository;

    @Transactional
    public Lecture handleCreateLecture(Lecture lecture) throws CustomException {
        if (!this.chapterRepository.findById(lecture.getChapter().getId()).isPresent()) {
            throw new CustomException("Chapter not found");
        }

        lecture = this.lectureRepository.save(lecture);

        Chapter chapter = this.chapterRepository.findById(lecture.getChapter().getId()).get();
        Course course = this.courseRepository.findById(chapter.getCourse().getId()).get();
        if (!course.getStatus().equals(CourseApproveEnum.PENDING)) {
            course.setStatus(CourseApproveEnum.PENDING);
            this.courseRepository.save(course);
        }

        return lecture;
    }

    public Lecture handleFetchLecture(Long id) throws CustomException {
        if (!this.lectureRepository.findById(id).isPresent()) {
            throw new CustomException("Lecture not found");
        }

        return this.lectureRepository.findById(id).get();
    }

    @Transactional
    public Lecture handleUpdateLecture(Lecture lecture) throws CustomException {
        Lecture lectureDB = this.handleFetchLecture(lecture.getId());

        if (lecture.getTitle() != null && !lecture.getTitle().equals("")) {
            lectureDB.setTitle(lecture.getTitle());
        }

        if (lecture.getDescription() != null && !lecture.getDescription().equals("")) {
            lectureDB.setDescription(lecture.getDescription());
        }

        if (lecture.getPreview() != null) {
            lectureDB.setPreview(lecture.getPreview());
        }

        lectureDB = this.lectureRepository.save(lectureDB);

        Chapter chapter = this.chapterRepository.findById(lectureDB.getChapter().getId()).get();
        Course course = this.courseRepository.findById(chapter.getCourse().getId()).get();
        if (!course.getStatus().equals(CourseApproveEnum.PENDING)) {
            course.setStatus(CourseApproveEnum.PENDING);
            this.courseRepository.save(course);
        }

        return lectureDB;
    }

    public void handleDeleteLecture(Long id) throws CustomException, IOException {
        if (!this.lectureRepository.findById(id).isPresent()) {
            throw new CustomException("Lecture not found");
        }

        this.lectureRepository.deleteById(id);
    }

    public Lecture handleUpdateLectureFile(Long id, MultipartFile file) throws CustomException {
        if (!this.lectureRepository.findById(id).isPresent()) {
            throw new CustomException("Lecture not found");
        }

        Lecture lecture = this.lectureRepository.findById(id).get();
        lecture.setFile(this.fileService.uploadFile(file, "lecture", id));

        lecture = this.lectureRepository.save(lecture);

        Chapter chapter = this.chapterRepository.findById(lecture.getChapter().getId()).get();
        Course course = this.courseRepository.findById(chapter.getCourse().getId()).get();
        if (!course.getStatus().equals(CourseApproveEnum.PENDING)) {
            course.setStatus(CourseApproveEnum.PENDING);
            this.courseRepository.save(course);
        }

        return lecture;
    }

    public LectureProcess handleUpdateProcess(Long uid, Long lid) throws CustomException {

        if (!this.userRepository.findById(uid).isPresent()) {
            throw new CustomException("User not found");
        }

        if (!this.lectureRepository.findById(lid).isPresent()) {
            throw new CustomException("Lecture not found");
        }

        User user = this.userRepository.findById(uid).get();
        Lecture lecture = this.lectureRepository.findById(lid).get();

        if (this.courseValidationService.isUserBoughtCourse(user, lecture.getChapter().getCourse())) {

            if (this.lectureProcessRepository.findByUserIdAndLectureId(uid, lid) == null) {
                LectureProcess lectureProcess = LectureProcess.builder()
                        .user(user)
                        .lecture(lecture)
                        .done(true)
                        .build();

                return this.lectureProcessRepository.save(lectureProcess);
            } else {
                throw new CustomException("User have done this lecture");
            }
        } else {
            throw new CustomException("User not buy course yet");
        }
    }

    public LectureProcess handleCheckLectureProcess(Long uid, Long lid) {
        return this.lectureProcessRepository.findByUserIdAndLectureId(uid, lid) != null
                ? this.lectureProcessRepository.findByUserIdAndLectureId(uid, lid)
                : null;
    }

}
