package com.vlearning.KLTN_final.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.UserCoupon;

@Repository
public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {

    void deleteByExpiresAtBefore(Instant now);

    List<UserCoupon> findAllByUserId(Long id);

}
