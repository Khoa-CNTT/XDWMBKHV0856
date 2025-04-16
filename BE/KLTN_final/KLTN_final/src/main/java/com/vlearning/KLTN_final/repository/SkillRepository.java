package com.vlearning.KLTN_final.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.vlearning.KLTN_final.domain.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long>, JpaSpecificationExecutor<Skill> {

    Skill findByName(String name);

    boolean existsByNameIn(List<Skill> skills);
}
