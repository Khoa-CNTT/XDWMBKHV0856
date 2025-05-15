package com.vlearning.KLTN_final.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.ActivityLog;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.LogService;
import com.vlearning.KLTN_final.util.exception.CustomException;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/v1")
public class LogController {

    @Autowired
    private LogService logService;

    @PostMapping("/log")
    public ResponseEntity<ResponseDTO<ActivityLog>> createLog(@RequestBody @Valid ActivityLog log)
            throws CustomException {

        ResponseDTO<ActivityLog> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create log success");
        res.setData(this.logService.handleCreateLog(log));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/logs")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralLogs(@Filter Specification<ActivityLog> spec,
            Pageable pageable) throws CustomException {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Fetch several logs success");
        res.setData(this.logService.handleFetchSeveralLogs(spec, pageable));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
