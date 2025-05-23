package com.vlearning.KLTN_final.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wishlist;
import com.vlearning.KLTN_final.domain.dto.request.CourseReq;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails;
import com.vlearning.KLTN_final.domain.dto.response.CourseResponse;
import com.vlearning.KLTN_final.domain.dto.response.UserDetails;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails.ChapterDetails;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails.ChapterDetails.LectureDetails;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.FieldRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.SkillRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.repository.WishlistRepository;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.transaction.Transactional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private OrderRepository orderRepository;

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

    private CourseResponse convertToCourseResponse(Course course) {

        Integer quantityStu = 0;

        if (course.getOrders() != null && course.getOrders().size() > 0) {
            quantityStu = this.orderRepository.findAllByCourseAndStatus(course, OrderStatus.PAID).size();
        }

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .shortIntroduce(course.getShortIntroduce())
                .description(course.getDescription())
                .image(course.getImage())
                .owner(course.getOwner())
                .price(course.getPrice())
                .totalRating(course.getReviews() == null ? 0 : course.getReviews().size())
                .overallRating(course.getOverallRating())
                .studentQuantity(quantityStu)
                .fields(course.getFields())
                .skills(course.getSkills())
                .active(course.isActive())
                .status(course.getStatus())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    @Transactional
    public CourseResponse handleCreateCourse(CourseReq courseReq) throws CustomException {

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

        this.courseRepository.save(course);

        return this.convertToCourseResponse(course);
    }

    public CourseResponse handleFetchCourse(Long id) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        return this.convertToCourseResponse(this.courseRepository.findById(id).get());
    }

    private UserDetails convertToInstructor(User user) {
        Integer totalCourses = user.getOwnCourses().size() > 0 ? user.getOwnCourses().size() : 0;
        Integer totalStudent = 0;
        Float totalUserRating = 0F;

        if (user.getOwnCourses() != null && user.getOwnCourses().size() > 0) {
            Set<User> students = new HashSet<>();

            // số lượng review
            Integer countReview = 0;

            // tổng điểm review
            Float totalRating = 0F;

            for (Course course : user.getOwnCourses()) {
                // lọc qua từng order paid
                for (Order order : course.getOrders()) {
                    if (order.getStatus().equals(OrderStatus.PAID)) {
                        students.add(order.getBuyer());
                    }
                }

                for (Review review : course.getReviews()) {
                    totalRating += review.getRating();
                }
                countReview += course.getReviews().size();
            }

            totalStudent = students.size();
            totalUserRating = totalRating / countReview;
        }

        return UserDetails.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .totalCourses(totalCourses)
                .totalStudents(totalStudent)
                .totalRating(totalUserRating)
                .build();
    }

    public CourseDetails handleFetchCourseDetails(Long id) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();

        List<Field> fields = new ArrayList<>();
        for (Field fieldDB : course.getFields()) {
            fields.add(Field.builder().id(fieldDB.getId()).name(fieldDB.getName()).skills(new ArrayList<>()).build());
        }

        for (Field field : fields) {
            for (Skill skillDB : course.getSkills()) {
                if (skillDB.getField().getId() == field.getId())
                    field.getSkills().add(Skill.builder().id(skillDB.getId()).name(skillDB.getName()).build());
            }
        }

        Integer totalLecture = 0;
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
                lectureDetails.setDescription(lecture.getDescription());
                lectureDetails.setPreview(lecture.getPreview());
                lectureDetails.setFile(lecture.getFile());
                lectureDetails.setCreatedAt(lecture.getCreatedAt());
                lectureDetails.setUpdatedAt(lecture.getUpdatedAt());

                lectureDetailsArr.add(lectureDetails);

                totalLecture++;
            }
            chapterDetails.setLectures(lectureDetailsArr);

            chapterDetailsArr.add(chapterDetails);
        }

        CourseDetails courseDetails = new CourseDetails();
        courseDetails.setId(course.getId());
        courseDetails.setTitle(course.getTitle());
        courseDetails.setShortIntroduce(course.getShortIntroduce());
        courseDetails.setDescription(course.getDescription());
        courseDetails.setImage(course.getImage());
        courseDetails.setOwner(this.convertToInstructor(course.getOwner()));
        courseDetails.setPrice(course.getPrice());
        courseDetails.setTotalChapter(course.getChapters().size() > 0 ? course.getChapters().size() : 0);
        courseDetails.setTotalLecture(totalLecture);
        courseDetails.setActive(course.isActive());
        courseDetails.setStatus(course.getStatus());
        courseDetails.setFields(fields);
        courseDetails.setCreatedAt(course.getCreatedAt());
        courseDetails.setUpdatedAt(course.getUpdatedAt());
        courseDetails.setChapters(chapterDetailsArr);
        courseDetails.setReviews(course.getReviews());
        courseDetails.setTotalReviews(course.getReviews() == null ? 0 : course.getReviews().size());
        courseDetails.setTotalRating(course.getOverallRating());

        return courseDetails;
    }

    public ResultPagination handleFetchSeveralCourses(Specification<Course> spec, Pageable pageable, Float rating) {
        boolean fetchAll = pageable == null || (pageable.getPageNumber() == 0 && pageable.getPageSize() == 20);

        if (fetchAll) {
            // lấy tất cả không phân trang
            List<Course> all = (pageable != null && pageable.getSort().isSorted())
                    ? courseRepository.findAll(spec, pageable.getSort())
                    : courseRepository.findAll(spec);

            List<CourseResponse> courseResponses = all.stream()
                    .map(this::convertToCourseResponse)
                    .toList();

            ResultPagination.Meta meta = new ResultPagination.Meta();
            meta.setPage(1);
            meta.setSize(all.size());
            meta.setTotalPage(1);
            meta.setTotalElement(all.size());

            ResultPagination resultPagination = new ResultPagination();
            resultPagination.setResult(courseResponses);
            resultPagination.setMeta(meta);

            return resultPagination;
        }

        // lấy tất cả nhưng phân trang
        Page<Course> page = courseRepository.findAll(spec, pageable);

        List<CourseResponse> courseResponses = page.getContent().stream()
                .map(this::convertToCourseResponse)
                .toList();

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(courseResponses);
        resultPagination.setMeta(meta);

        return resultPagination;
    }

    public CourseResponse handleUpdateCourse(CourseReq courseReq) throws CustomException {

        if (!this.courseRepository.findById(courseReq.getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(courseReq.getId()).get();

        if (courseReq.getTitle() != null && !courseReq.getTitle().equals("")) {
            course.setTitle(courseReq.getTitle());
        }

        if (courseReq.getShortIntroduce() != null && !courseReq.getShortIntroduce().equals("")) {
            course.setShortIntroduce(courseReq.getShortIntroduce());
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

        this.courseRepository.save(course);

        return this.convertToCourseResponse(course);
    }

    private void deleteRelatedPartsOfCourse(Course course) {

        // xoa course-field/skill
        course.getFields().clear();
        course.getSkills().clear();

        // xoa course-wishlist
        for (Wishlist wishlist : course.getWishlists()) {
            wishlist.getCourses().remove(course);
            this.wishlistRepository.save(wishlist);
        }

        this.courseRepository.save(course);
    }

    public void handleDeleteCourse(Long id) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();
        this.deleteRelatedPartsOfCourse(course);

        this.courseRepository.deleteById(id);
    }

    public CourseResponse handleUpdateCourseActive(Long id) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();
        course.setActive(!course.isActive());

        this.courseRepository.save(course);
        return this.convertToCourseResponse(course);
    }

    public CourseResponse handleUpdateCourseImage(Long id, MultipartFile file) throws CustomException {
        if (!this.courseRepository.findById(id).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course course = this.courseRepository.findById(id).get();
        course.setImage(this.fileService.uploadFile(file, "course", id));

        this.courseRepository.save(course);

        return this.convertToCourseResponse(course);
    }

    public CourseResponse handleUpdateCourseStatus(Course course) throws Exception {
        if (!this.courseRepository.findById(course.getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        Course courseDB = this.courseRepository.findById(course.getId()).get();
        courseDB.setStatus(course.getStatus());

        this.courseRepository.save(courseDB);

        return this.convertToCourseResponse(courseDB);
    }

}
