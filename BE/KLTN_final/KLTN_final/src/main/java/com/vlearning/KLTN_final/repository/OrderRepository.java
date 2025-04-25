package com.vlearning.KLTN_final.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.constant.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    List<Order> findAllByBuyer(User user);

    List<Order> findAllByOrderCode(Long orderCode);

    List<Order> findAllByStatus(OrderStatus status);

    List<Order> findAllByCourse(Course course);

    List<Order> findAllByCourseAndStatus(Course course, OrderStatus status);

    Order findByStatusAndBuyerIdAndCourseId(OrderStatus paid, Long uid, Long cid);

    List<Order> findAllByStatusAndBuyerIdAndCourseId(OrderStatus paid, Long uid, Long cid);
}
