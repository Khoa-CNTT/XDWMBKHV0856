package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.UpdateReviewReq;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
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
    private OrderRepository orderRepository;

    public Review handleCreateReview(Review review) throws CustomException {

        if (this.userRepository.findById(review.getUser().getId()).isPresent() &&
                this.courseRepository.findById(review.getCourse().getId()).isPresent()) {

            boolean havePermission = false;
            User userDB = this.userRepository.findById(review.getUser().getId()).get();
            for (Order order : this.orderRepository.findAllByBuyer(userDB)) {
                if (order.getCourse().getId() == review.getCourse().getId()) {
                    // have permission
                    havePermission = true;
                }
            }

            if (havePermission) {
                boolean haveReviewed = false;
                for (Review reviewInArray : userDB.getReviews()) {
                    if (reviewInArray.getCourse().getId() == review.getCourse().getId())
                        haveReviewed = true;
                }

                if (!haveReviewed) {
                    return this.reviewRepository.save(review);
                } else {
                    throw new CustomException("User has rated this course before");
                }

            } else {
                throw new CustomException("User doesn't have permission");
            }
        } else {
            throw new CustomException("User or course not found");
        }
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

        return this.reviewRepository.save(reviewDB);
    }

    public void handleDeleteReview(Long id) throws CustomException {
        if (!this.reviewRepository.findById(id).isPresent()) {
            throw new CustomException("Review not found");
        }

        this.reviewRepository.deleteById(id);
    }
}
