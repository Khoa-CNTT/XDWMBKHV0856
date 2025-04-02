package com.vlearning.KLTN_final.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.CouponCollection;
import com.vlearning.KLTN_final.domain.User;

@Repository
public interface CouponCollectionRepository
        extends JpaRepository<CouponCollection, Long> {

    public CouponCollection findByUser(User user);
}
