package com.vlearning.KLTN_final.service;

import com.vlearning.KLTN_final.util.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.FieldRepository;

@Service
public class FieldService {

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private SkillService skillService;

    public Field handleCreateField(Field field) throws CustomException {
        if (this.fieldRepository.findByName(field.getName()) != null) {
            throw new CustomException("Field already exist");
        }

        return this.fieldRepository.save(field);
    }

    public Field handleFetchField(Long id) throws CustomException {
        if (!this.fieldRepository.findById(id).isPresent()) {
            throw new CustomException("Field not found");
        }

        return this.fieldRepository.findById(id).get();
    }

    public ResultPagination handleFetchFields(Specification<Field> spec, Pageable pageable) {
        Page<Field> page = this.fieldRepository.findAll(spec, pageable);

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

    public void handleDeleteField(Long id) throws CustomException {
        if (!this.fieldRepository.findById(id).isPresent()) {
            throw new CustomException("Field not found");
        }

        Field field = this.fieldRepository.findById(id).get();

        // Gỡ liên kết field-user
        for (User user : field.getUsers()) {
            user.getFields().remove(field);
        }

        // Gỡ liên kết field-course và course-skill
        for (Course course : field.getCourses()) {
            course.getFields().remove(field);
            for (Skill skill : field.getSkills()) {
                course.getSkills().remove(skill);
            }
        }

        fieldRepository.save(field); // Cập nhật bảng trung gian
        fieldRepository.delete(field); // Bây giờ mới xóa được
    }

    public Field handleUpdateField(Field field) throws CustomException {
        if (!this.fieldRepository.findById(field.getId()).isPresent()) {
            throw new CustomException("Field not found");
        }

        Field fieldDB = this.fieldRepository.findById(field.getId()).get();
        if (field.getName() != null && !field.getName().equals("")) {
            for (Field fieldInArray : this.fieldRepository.findAll()) {
                if (fieldInArray.getName().equals(fieldDB.getName()) && fieldInArray.getId() != fieldDB.getId()) {
                    throw new CustomException("Field already exist");
                } else {
                    fieldDB.setName(field.getName());
                }
            }
        }

        return this.fieldRepository.save(fieldDB);
    }

}
