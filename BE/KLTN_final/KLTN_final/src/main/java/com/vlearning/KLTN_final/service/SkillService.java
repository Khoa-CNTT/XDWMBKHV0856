package com.vlearning.KLTN_final.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.FieldRepository;
import com.vlearning.KLTN_final.repository.SkillRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private FieldRepository fieldRepository;

    public Skill handleCreateSkill(Skill skill) throws CustomException {

        if (!this.fieldRepository.findById(skill.getField().getId()).isPresent()) {
            throw new CustomException("Field not found");
        } else {
            skill.setField(this.fieldRepository.findById(skill.getField().getId()).get());
        }

        return this.skillRepository.save(skill);
    }

    public Skill handleFetchSkill(Long id) throws CustomException {

        if (!this.skillRepository.findById(id).isPresent()) {
            throw new CustomException("Skill not found");
        }

        return this.skillRepository.findById(id).get();
    }

    public ResultPagination handleFetchSkills(Specification<Skill> spec, Pageable pageable) {
        boolean fetchAll = pageable == null || (pageable.getPageNumber() == 0 && pageable.getPageSize() == 20);

        if (fetchAll) {
            List<Skill> all = (pageable != null && pageable.getSort().isSorted())
                    ? skillRepository.findAll(spec, pageable.getSort())
                    : skillRepository.findAll(spec);

            ResultPagination.Meta meta = new ResultPagination.Meta();
            meta.setPage(1);
            meta.setSize(all.size());
            meta.setTotalPage(1);
            meta.setTotalElement(all.size());

            ResultPagination resultPagination = new ResultPagination();
            resultPagination.setResult(all);
            resultPagination.setMeta(meta);

            return resultPagination;
        }

        // Nếu có phân trang thực sự
        Page<Skill> page = this.skillRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(page.getContent());
        resultPagination.setMeta(meta);

        return resultPagination;
    }

    public Skill handleUpdateSkill(Skill skill) throws CustomException {
        if (!this.skillRepository.findById(skill.getId()).isPresent()) {
            throw new CustomException("Skill not found");
        }

        Skill skillDB = this.skillRepository.findById(skill.getId()).get();
        if (skill.getName() != null && !skill.getName().equals("")) {
            for (Skill skillInArray : skillDB.getField().getSkills()) {
                if (skillInArray.getName().equals(skillDB.getName()) && skillInArray.getId() != skillDB.getId()) {
                    throw new CustomException("Skill already exist");
                } else {
                    skillDB.setName(skill.getName());
                }
            }
        }

        return this.skillRepository.save(skillDB);
    }

    private void deleteRelatedPartsOfSkill(Skill skill) {
        // Gỡ liên kết skill-user
        for (User user : skill.getUsers()) {
            user.getSkills().remove(skill);
        }

        // gỡ liên kết skill-course
        for (Course course : skill.getCourses()) {
            course.getSkills().remove(skill);
        }

        this.skillRepository.save(skill);
    }

    public void handleDeleteSkill(Long id) throws CustomException {
        if (!this.skillRepository.findById(id).isPresent()) {
            throw new CustomException("Skill not found");
        }

        Skill skill = this.skillRepository.findById(id).get();

        this.deleteRelatedPartsOfSkill(skill);

        this.skillRepository.deleteById(id);
    }

    public void handleDeleteSeveralSkills(Long[] skills) throws CustomException {
        for (Long i : skills) {
            if (this.skillRepository.findById(i).isPresent()) {
                this.handleDeleteSkill(i);
            }
        }
    }

}
