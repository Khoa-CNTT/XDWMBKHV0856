package com.vlearning.KLTN_final.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.UpdateReviewReq;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.ReviewRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseValidationService courseValidationService;

    public Review handleCreateReview(Review review) throws CustomException {

        if (!this.userRepository.findById(review.getUser().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        if (!this.courseRepository.findById(review.getCourse().getId()).isPresent()) {
            throw new CustomException("Course not found");
        }

        User user = this.userRepository.findById(review.getUser().getId()).get();
        Course course = this.courseRepository.findById(review.getCourse().getId()).get();

        if (this.courseValidationService.isUserBoughtCourse(user, course)) {
            List<Review> reviews = this.reviewRepository.findAllByUser(user);
            if (reviews != null)
                for (Review reviewDB : reviews) {
                    if (reviewDB.getCourse().getId() == review.getCourse().getId()) {
                        throw new CustomException("User reviewed before");
                    }
                }
        } else {
            throw new CustomException("User don't have permission");
        }

        review = this.reviewRepository.save(review);

        // tinh lai overall cho course
        Float overall = 0F;
        if (course.getReviews() != null && course.getReviews().size() > 0) {
            for (Review reviewDB : course.getReviews()) {
                overall += reviewDB.getRating();
            }

            overall /= course.getReviews().size();
            course.setOverallRating(overall);
            this.courseRepository.save(course);
        }

        return review;
    }

    public Review handleFetchReview(Long id) throws CustomException {
        if (!this.reviewRepository.findById(id).isPresent()) {
            throw new CustomException("Review not found");
        }

        return this.reviewRepository.findById(id).get();
    }

    public ResultPagination handleFetchSeveralReviews(Specification<Review> spec, Pageable pageable) {

        Page<Review> page = this.reviewRepository.findAll(spec, pageable);

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

    public Review handleUpdateReview(UpdateReviewReq review) throws CustomException {

        if (!this.reviewRepository.findById(review.getId()).isPresent()) {
            throw new CustomException("Review not found");
        }

        Review reviewDB = this.reviewRepository.findById(review.getId()).get();
        if (reviewDB.getUser().getId() != review.getUserId()) {
            throw new CustomException("User not found or doesn't have permission");
        }

        reviewDB.setRating(review.getRating());
        reviewDB.setComment(review.getComment());

        reviewDB = this.reviewRepository.save(reviewDB);

        // tinh lai overall cho course
        Course course = reviewDB.getCourse();

        Float overall = 0F;
        if (course.getReviews() != null && course.getReviews().size() > 0) {
            for (Review reviewInArr : course.getReviews()) {
                overall += reviewInArr.getRating();
            }

            overall /= course.getReviews().size();
            course.setOverallRating(overall);
            this.courseRepository.save(course);
        }

        return reviewDB;
    }

    public void handleDeleteReview(Long id) throws CustomException {
        if (!this.reviewRepository.findById(id).isPresent()) {
            throw new CustomException("Review not found");
        }

        this.reviewRepository.deleteById(id);
    }
}
