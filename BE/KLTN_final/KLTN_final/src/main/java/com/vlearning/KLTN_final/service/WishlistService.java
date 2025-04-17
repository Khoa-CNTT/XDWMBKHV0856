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

    @Autowired
    private OrderService orderService;

    public Wishlist handleAddCourseToWishlist(Long wishlistId, Long courseId) throws CustomException {
        Wishlist wishlist = this.wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new CustomException("Wishlist not found"));

        Course course = this.courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomException("Course not found"));

        User user = wishlist.getUser();
        if (!this.orderService.isCourseAvailable(course) || this.orderService.isUserBoughtCourse(user, course)
                || this.orderService.isUserTheCourseOwner(user, course)) {
            throw new CustomException("Course is not available or user bought it before or user is the course owner");
        }

        // Thêm vào set (Set tự động loại bỏ phần tử trùng)
        if (!wishlist.getCourses().add(course)) {
            throw new CustomException("Course already exists in the wishlist");
        }

        return this.wishlistRepository.save(wishlist);
    }

    public Wishlist handleFetchWishlist(Long userId) throws CustomException {
        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        return this.wishlistRepository.findByUser(user);
    }

    public Wishlist handleRemoveCourseFromWishlist(Long wishlistId, Long courseId) throws CustomException {
        if (!this.wishlistRepository.findById(wishlistId).isPresent()) {
            throw new CustomException("Wishlist not found");
        }

        if (!this.courseRepository.findById(courseId).isPresent()) {
            throw new CustomException("Course not found");
        }

        Wishlist wishlist = this.wishlistRepository.findById(wishlistId).get();
        Course course = this.courseRepository.findById(courseId).get();
        Set<Course> courses = wishlist.getCourses();
        courses.remove(course);

        wishlist.setCourses(courses);

        return this.wishlistRepository.save(wishlist);
    }
}
