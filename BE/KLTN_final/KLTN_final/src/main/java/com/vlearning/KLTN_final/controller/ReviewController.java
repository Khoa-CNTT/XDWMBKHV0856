package com.vlearning.KLTN_final.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.dto.request.UpdateReviewReq;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.ReviewService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/v1")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/review")
    public ResponseEntity<ResponseDTO<Review>> createReview(@RequestBody @Valid Review review) throws CustomException {

        ResponseDTO<Review> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create review success");
        res.setData(this.reviewService.handleCreateReview(review));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/review/{id}")
    public ResponseEntity<ResponseDTO<Review>> fetchReview(@PathVariable Long id) throws CustomException {

        ResponseDTO<Review> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch review success");
        res.setData(this.reviewService.handleFetchReview(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/reviews")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralReviews(@Filter Specification<Review> spec,
            Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Fetch review success");
        res.setData(this.reviewService.handleFetchSeveralReviews(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/review")
    public ResponseEntity<ResponseDTO<Review>> updateReview(@RequestBody @Valid UpdateReviewReq review)
            throws CustomException {

        ResponseDTO<Review> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Update review success");
        res.setData(this.reviewService.handleUpdateReview(review));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteReview(@PathVariable Long id) throws CustomException {

        this.reviewService.handleDeleteReview(id);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Delete review success");

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

}
