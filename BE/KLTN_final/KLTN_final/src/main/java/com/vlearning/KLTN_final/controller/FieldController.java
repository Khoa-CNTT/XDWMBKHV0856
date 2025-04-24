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
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.FieldService;
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
public class FieldController {

    @Autowired
    private FieldService fieldService;

    @PostMapping("/field")
    public ResponseEntity<ResponseDTO<Field>> createField(@RequestBody @Valid Field field) throws CustomException {

        ResponseDTO<Field> res = new ResponseDTO<>();
        res.setMessage("Create field success");
        res.setStatus(HttpStatus.CREATED.value());
        res.setData(this.fieldService.handleCreateField(field));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/field/{id}")
    public ResponseEntity<ResponseDTO<Field>> fetchField(@PathVariable Long id) throws CustomException {

        ResponseDTO<Field> res = new ResponseDTO<>();
        res.setMessage("Fetch field success");
        res.setStatus(HttpStatus.OK.value());
        res.setData(this.fieldService.handleFetchField(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/fields")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralFields(@Filter Specification<Field> spec,
            Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setMessage("Fetch several fields success");
        res.setStatus(HttpStatus.OK.value());
        res.setData(this.fieldService.handleFetchFields(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/field")
    public ResponseEntity<ResponseDTO<Field>> updateField(@RequestBody Field field) throws CustomException {

        ResponseDTO<Field> res = new ResponseDTO<>();
        res.setMessage("Update field success");
        res.setStatus(HttpStatus.OK.value());
        res.setData(this.fieldService.handleUpdateField(field));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/field/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteField(@PathVariable Long id) throws CustomException {

        this.fieldService.handleDeleteField(id);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setMessage("Delete field success");
        res.setStatus(HttpStatus.OK.value());

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/fields")
    public ResponseEntity<ResponseDTO<Object>> deleteSeveralUsers(@RequestBody Long[] fields)
            throws CustomException {

        this.fieldService.handleDeleteSeveralFields(fields);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Complete delete several fields");

        return ResponseEntity.ok().body(res);
    }

}
