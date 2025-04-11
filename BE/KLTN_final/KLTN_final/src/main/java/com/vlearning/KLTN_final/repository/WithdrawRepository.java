package com.vlearning.KLTN_final.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.WithdrawRequest;

@Repository
public interface WithdrawRepository
        extends JpaRepository<WithdrawRequest, Long>, JpaSpecificationExecutor<WithdrawRequest> {

}
