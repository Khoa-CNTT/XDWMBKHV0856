package com.vlearning.KLTN_final.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.util.constant.RoleEnum;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    User findByEmail(String email);

    List<User> findAllByRole(RoleEnum role);

}
