package com.vlearning.KLTN_final.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vlearning.KLTN_final.domain.Chapter;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.Wishlist;
import com.vlearning.KLTN_final.domain.dto.request.CourseReq;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails.ChapterDetails;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails.ChapterDetails.LectureDetails;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.FieldRepository;
import com.vlearning.KLTN_final.repository.SkillRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.repository.WishlistRepository;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private FileService fileService;

    public Course handleCreateCourse(CourseReq courseReq) throws CustomException {

        ModelMapper modelMapper = new ModelMapper();
        Course course = modelMapper.map(courseReq, Course.class);

        course.setId(null);

        if (!this.userRepository.findById(course.getOwner().getId()).isPresent()) {
            throw new CustomException("User not found");
        }
        course.setOwner(this.userRepository.findById(course.getOwner().getId()).get());

        // fields
        if (courseReq.getFields() != null && courseReq.getFields().size() > 0) {
            List<Field> newFieldsList = new ArrayList<>();
            for (Field field : courseReq.getFields()) {
                if (this.fieldRepository.findById(field.getId()).isPresent()) {
                    newFieldsList.add(this.fieldRepository.findById(field.getId()).get());
                }
            }

            // neu khong co field nao trong request ton tai
            if (newFieldsList == null || newFieldsList.size() == 0) {
                throw new CustomException("Field not found");
            } else {
                course.setFields(newFieldsList);
            }
        } else {
            throw new CustomException("Field not found");
        }

        // skills
        if (courseReq.getSkills() != null && courseReq.getSkills().size() > 0) {
            List<Skill> newSkillsList = new ArrayList<>();
            for (Skill skill : courseReq.getSkills()) {
                // kiem tra ton tai
                if (this.skillRepository.findById(skill.getId()).isPresent()) {
                    skill = this.skillRepository.findById(skill.getId()).get();
                    // kiem tra co o trong field o tren khong
                    for (Field field : course.getFields()) {
                        if (skill.getField().getId() == field.getId()) {
                            newSkillsList.add(skill);
                            break;
                        }
                    }
                }
            }
            if (newSkillsList == null || newSkillsList.size() == 0) {
                throw new CustomException("Skill not found");
            } else {
                course.setSkills(newSkillsList);
            }
        } else {
            throw new CustomException("Skill not found");
        }

        return this.courseRepository.save(course);
    }

    public Course handleFetchCourse(Long id) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }
        return this.courseRepository.findById(id).get();
    }

    public CourseDetails handleFetchCourseDetails(Long id) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();

        List<ChapterDetails> chapterDetailsArr = new ArrayList<>();
        for (Chapter chapter : course.getChapters()) {
            ChapterDetails chapterDetails = new ChapterDetails();
            chapterDetails.setId(chapter.getId());
            chapterDetails.setTitle(chapter.getTitle());
            chapterDetails.setCreatedAt(chapter.getCreatedAt());
            chapterDetails.setUpdatedAt(chapter.getUpdatedAt());

            List<LectureDetails> lectureDetailsArr = new ArrayList<>();
            for (Lecture lecture : chapter.getLectures()) {
                LectureDetails lectureDetails = new LectureDetails();
                lectureDetails.setId(lecture.getId());
                lectureDetails.setTitle(lecture.getTitle());
                lectureDetails.setFile(lecture.getFile());
                lectureDetails.setCreatedAt(lecture.getCreatedAt());
                lectureDetails.setUpdatedAt(lecture.getUpdatedAt());

                lectureDetailsArr.add(lectureDetails);
            }
            chapterDetails.setLectures(lectureDetailsArr);

            chapterDetailsArr.add(chapterDetails);
        }

        CourseDetails courseDetails = new CourseDetails();
        courseDetails.setId(course.getId());
        courseDetails.setTitle(course.getTitle());
        courseDetails.setDescription(course.getDescription());
        courseDetails.setImage(course.getImage());
        courseDetails.setOwner(course.getOwner());
        courseDetails.setPrice(course.getPrice());
        courseDetails.setFields(course.getFields());
        courseDetails.setSkills(course.getSkills());
        courseDetails.setCreatedAt(course.getCreatedAt());
        courseDetails.setUpdatedAt(course.getUpdatedAt());
        courseDetails.setChapters(chapterDetailsArr);

        return courseDetails;
    }

    public ResultPagination handleFetchSeveralCourses(Specification<Course> spec, Pageable pageable) {

        Page<Course> page = this.courseRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(page.getContent());
        resultPagination.setMeta(meta);

        return resultPagination;
    }

    public Course handleUpdateCourse(CourseReq courseReq) throws CustomException {

        if (!this.courseRepository.findById(courseReq.getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(courseReq.getId()).get();

        if (courseReq.getTitle() != null && !courseReq.getTitle().equals("")) {
            course.setTitle(courseReq.getTitle());
        }

        if (courseReq.getDescription() != null && !courseReq.getDescription().equals("")) {
            course.setDescription(courseReq.getDescription());
        }

        if (courseReq.getImage() != null && !courseReq.getImage().equals("")) {
            course.setImage(courseReq.getImage());
        }

        if (courseReq.getPrice() != null && courseReq.getPrice() >= 0) {
            course.setPrice(courseReq.getPrice());
        }

        // fields
        if (courseReq.getFields() != null && courseReq.getFields().size() > 0) {
            List<Field> newFieldsList = new ArrayList<>();
            for (Field field : courseReq.getFields()) {
                if (this.fieldRepository.findById(field.getId()).isPresent()) {
                    newFieldsList.add(this.fieldRepository.findById(field.getId()).get());
                }
            }

            // neu khong co field nao trong request ton tai
            if (newFieldsList == null || newFieldsList.size() == 0) {
                throw new CustomException("Field not found");
            } else {
                course.setFields(newFieldsList);
            }
        } else {
            throw new CustomException("Field not found");
        }

        // skills
        if (courseReq.getSkills() != null && courseReq.getSkills().size() > 0) {
            List<Skill> newSkillsList = new ArrayList<>();
            for (Skill skill : courseReq.getSkills()) {
                // kiem tra ton tai
                if (this.skillRepository.findById(skill.getId()).isPresent()) {
                    skill = this.skillRepository.findById(skill.getId()).get();
                    // kiem tra co o trong field o tren khong
                    for (Field field : course.getFields()) {
                        if (skill.getField().getId() == field.getId()) {
                            newSkillsList.add(skill);
                            break;
                        }
                    }
                }
            }
            if (newSkillsList == null || newSkillsList.size() == 0) {
                throw new CustomException("Skill not found");
            } else {
                course.setSkills(newSkillsList);
            }
        } else {
            throw new CustomException("Skill not found");
        }

        course.setStatus(CourseApproveEnum.PENDING);

        return this.courseRepository.save(course);
    }

    public void handleDeleteCourse(Long id) throws CustomException, IOException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();

        for (Field field : course.getFields()) {
            field.getCourses().remove(course);
            this.fieldRepository.save(field);
        }

        for (Skill skill : course.getSkills()) {
            skill.getCourses().remove(course);
            this.skillRepository.save(skill);
        }

        for (Wishlist wishlist : course.getWishlists()) {
            wishlist.getCourses().remove(course);
            this.wishlistRepository.save(wishlist);
        }

        this.courseRepository.deleteById(id);
    }

    public Course handleUpdateCourseImage(Long id, MultipartFile file) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();
        course.setImage(this.fileService.uploadFile(file, "course", id));

        return this.courseRepository.save(course);
    }

    public Course handleUpdateCourseStatus(Course course) throws Exception {
        if (!this.courseRepository.findById(course.getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course courseDB = this.courseRepository.findById(course.getId()).get();
        courseDB.setStatus(course.getStatus());

        return this.courseRepository.save(courseDB);
    }

}
