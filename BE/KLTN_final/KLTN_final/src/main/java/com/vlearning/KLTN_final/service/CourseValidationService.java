package com.vlearning.KLTN_final.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import com.vlearning.KLTN_final.util.constant.OrderStatus;

@Service
public class CourseValidationService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public boolean isUserBoughtCourse(User user, Course course) {

        user = this.userRepository.findById(user.getId()).get();
        List<Order> orders = this.orderRepository.findAllByBuyer(user);
        if (orders != null && orders.size() > 0) {
            for (Order order : orders) {
                if (order.getCourse().getId() == course.getId() && order.getStatus().equals(OrderStatus.PAID))
                    return true;
            }
        }
        return false;
    }

    public boolean isUserTheCourseOwner(User user, Course course) {
        user = this.userRepository.findById(user.getId()).get();
        course = this.courseRepository.findById(course.getId()).get();
        if (course.getOwner().getId() == user.getId()) {
            return true;
        }

        return false;
    }

    public boolean isCourseAvailable(Course course) {
        course = this.courseRepository.findById(course.getId()).get();
        if (course.getStatus().equals(CourseApproveEnum.APPROVED) && course.isActive()) {
            return true;
        }

        return false;
    }
}
