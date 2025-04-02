package com.vlearning.KLTN_final.util.exception;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;

@RestControllerAdvice
public class GlobalException {

    // handle loi validate
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseDTO<Object>> validateExceptionHandler(MethodArgumentNotValidException ex) {
        ResponseDTO<Object> res = new ResponseDTO<>();

        // lấy message lỗi
        BindingResult result = ex.getBindingResult();
        final List<FieldError> fieldErrors = result.getFieldErrors();

        List<String> errors = new ArrayList<>();
        for (FieldError fieldError : fieldErrors) {
            errors.add(fieldError.getDefaultMessage());
        }
        res.setMessage(errors.size() > 1 ? errors : errors.get(0));

        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setError("Validate exception.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseDTO<Object>> customExceptionHandler(CustomException ex) {
        ResponseDTO<Object> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setError("Exception.");
        res.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}
