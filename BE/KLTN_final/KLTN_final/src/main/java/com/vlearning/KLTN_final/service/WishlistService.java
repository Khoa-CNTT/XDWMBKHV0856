package com.vlearning.KLTN_final.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wishlist;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.repository.WishlistRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public Wishlist handleAddCourseToWishlist(Long wishlistId, Long courseId) throws CustomException {
        Wishlist wishlist = this.wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new CustomException("Wishlist not found"));

        Course course = this.courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomException("Course not found"));

        // Thêm vào set (Set tự động loại bỏ phần tử trùng)
        if (!wishlist.getCourses().add(course)) {
            throw new CustomException("Course already exists in the wishlist");
        }

        return this.wishlistRepository.save(wishlist);
    }

    public Wishlist handleFetcjWishlist(Long userId) throws CustomException {
        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        return this.wishlistRepository.findByUser(user);
    }

    public Wishlist handleRemoveCourseFromWishlist(Long wishlistId, Long courseId) throws CustomException {
        if (!this.wishlistRepository.findById(wishlistId).isPresent()) {
            throw new CustomException("Wishlist not found");
        }

        Wishlist wishlist = this.wishlistRepository.findById(wishlistId).get();
        Set<Course> courses = wishlist.getCourses();
        for (Course course : courses) {
            if (course.getId() == courseId) {
                courses.remove(course);
            }
        }

        wishlist.setCourses(courses);

        return this.wishlistRepository.save(wishlist);
    }
}
