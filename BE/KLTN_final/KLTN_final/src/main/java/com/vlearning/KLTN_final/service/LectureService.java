package com.vlearning.KLTN_final.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.repository.ChapterRepository;
import com.vlearning.KLTN_final.repository.LectureRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class LectureService {

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private FileService fileService;

    public Lecture handleCreateLecture(Lecture lecture) throws CustomException {
        if (!this.chapterRepository.findById(lecture.getChapter().getId()).isPresent()) {
            throw new CustomException("Chapter not found");
        }

        return this.lectureRepository.save(lecture);
    }

    public Lecture handleFetchLecture(Long id) throws CustomException {
        if (!this.lectureRepository.findById(id).isPresent()) {
            throw new CustomException("Lecture not found");
        }

        return this.lectureRepository.findById(id).get();
    }

    public Lecture handleUpdateLecture(Lecture lecture) throws CustomException {
        Lecture lectureDB = this.handleFetchLecture(lecture.getId());

        if (lecture.getTitle() != null && !lecture.getTitle().equals("")) {
            lectureDB.setTitle(lecture.getTitle());
        }

        if (lecture.getFile() != null && !lecture.getFile().equals("")) {
            lectureDB.setFile(lecture.getFile());
        }

        return this.lectureRepository.save(lectureDB);
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

        return this.lectureRepository.save(lecture);
    }

}
