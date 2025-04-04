package com.vlearning.KLTN_final.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    List<Order> findAllByBuyer(User user);
}
