package com.vlearning.KLTN_final.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Wallet findByUserId(Long id);

}
