package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.dto.request.CourseReq;
import com.vlearning.KLTN_final.domain.dto.response.CourseDetails;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.CourseService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/v1")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping("/course")
    public ResponseEntity<ResponseDTO<Course>> createCourse(@RequestBody @Valid CourseReq course)
            throws CustomException {

        ResponseDTO<Course> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create course success");
        res.setData(this.courseService.handleCreateCourse(course));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<ResponseDTO<Course>> fetchCourse(@PathVariable Long id) throws CustomException {

        ResponseDTO<Course> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch course success");
        res.setData(this.courseService.handleFetchCourse(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/course-details/{id}")
    public ResponseEntity<ResponseDTO<CourseDetails>> fetchCourseDetails(@PathVariable Long id) throws CustomException {

        ResponseDTO<CourseDetails> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch course detail success");
        res.setData(this.courseService.handleFetchCourseDetails(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/courses")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralCourses(@Filter Specification<Course> spec,
            Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch several courses success");
        res.setData(this.courseService.handleFetchSeveralCourses(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/course")
    public ResponseEntity<ResponseDTO<Course>> updateCourse(@RequestBody CourseReq course)
            throws CustomException {

        ResponseDTO<Course> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update course success");
        res.setData(this.courseService.handleUpdateCourse(course));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/course/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteCourse(@PathVariable Long id) throws CustomException, IOException {

        this.courseService.handleDeleteCourse(id);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Delete course success");

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PatchMapping("/course.image/{id}")
    public ResponseEntity<ResponseDTO<Course>> updateCourseImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file)
            throws CustomException, IOException {

        ResponseDTO<Course> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update course success");
        res.setData(this.courseService.handleUpdateCourseImage(id, file));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PatchMapping("/course.status")
    public ResponseEntity<ResponseDTO<Course>> updateCourseStatus(
            @RequestBody Course course,
            @RequestParam("file") MultipartFile file)
            throws Exception {

        ResponseDTO<Course> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update course success");
        res.setData(this.courseService.handleUpdateCourseStatus(course, file));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

}
