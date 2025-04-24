package com.vlearning.KLTN_final.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.SkillService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/v1")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping("/skill")
    public ResponseEntity<ResponseDTO<Skill>> createSkill(@RequestBody @Valid Skill skill) throws CustomException {

        ResponseDTO<Skill> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create skill success");
        res.setData(this.skillService.handleCreateSkill(skill));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/skill/{id}")
    public ResponseEntity<ResponseDTO<Skill>> fetchSkill(@PathVariable Long id) throws CustomException {

        ResponseDTO<Skill> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch skill success");
        res.setData(this.skillService.handleFetchSkill(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/skills")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralSkills(@Filter Specification<Skill> spec,
            Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setMessage("Fetch several skills success");
        res.setStatus(HttpStatus.OK.value());
        res.setData(this.skillService.handleFetchSkills(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/skill")
    public ResponseEntity<ResponseDTO<Skill>> updateSkill(@RequestBody Skill skill) throws CustomException {

        ResponseDTO<Skill> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update skill success");
        res.setData(this.skillService.handleUpdateSkill(skill));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/skill/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteSkill(@PathVariable Long id) throws CustomException {

        this.skillService.handleDeleteSkill(id);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Delete skill success");

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/skills")
    public ResponseEntity<ResponseDTO<Object>> deleteSeveralUsers(@RequestBody Long[] skills)
            throws CustomException {

        this.skillService.handleDeleteSeveralSkills(skills);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Complete delete several skills");

        return ResponseEntity.ok().body(res);
    }

}
