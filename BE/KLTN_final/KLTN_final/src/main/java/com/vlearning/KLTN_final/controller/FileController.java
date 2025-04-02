package com.vlearning.KLTN_final.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.FileService;
import com.vlearning.KLTN_final.util.exception.CustomException;

@RestController
@RequestMapping("/v1")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/file/upload")
    public ResponseEntity<ResponseDTO<String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("entity") String entity,
            @RequestParam("id") long id)
            throws CustomException {

        ResponseDTO<String> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Upload success");
        res.setData(this.fileService.uploadFile(file, entity, id));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
