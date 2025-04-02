package com.vlearning.KLTN_final.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Wishlist findByUser(User user);

}
