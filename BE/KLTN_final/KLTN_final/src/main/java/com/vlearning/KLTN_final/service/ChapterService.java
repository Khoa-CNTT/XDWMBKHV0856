package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Chapter;
import com.vlearning.KLTN_final.repository.ChapterRepository;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;

    public Chapter handleCreateChapter(Chapter chapter) throws CustomException {

        if (!this.courseRepository.findById(chapter.getCourse().getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        return this.chapterRepository.save(chapter);
    }

    public Chapter handleFetchChapter(Long id) throws CustomException {

        if (!this.chapterRepository.findById(id).isPresent()) {
            throw new CustomException("Chapter not found");
        }

        return this.chapterRepository.findById(id).get();
    }

    public Chapter handleUpdateChapter(Chapter chapter) throws CustomException {

        if (!this.chapterRepository.findById(chapter.getId()).isPresent()) {
            throw new CustomException("Chapter not found");
        }

        Chapter chapterDB = this.chapterRepository.findById(chapter.getId()).get();
        if (chapter.getTitle() != null && !chapter.getTitle().equals("")) {
            chapterDB.setTitle(chapter.getTitle());
        }

        return this.chapterRepository.save(chapterDB);
    }

    public void handleDeleteChapter(Long id) throws CustomException {

        if (!this.chapterRepository.findById(id).isPresent()) {
            throw new CustomException("Chapter not found");
        }

        this.chapterRepository.deleteById(id);
    }
}
