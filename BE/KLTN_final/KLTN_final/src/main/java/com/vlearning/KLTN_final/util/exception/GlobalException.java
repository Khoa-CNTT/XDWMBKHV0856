package com.vlearning.KLTN_final.util.exception;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.dao.DataIntegrityViolationException;
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

    // handle loi validate khi tao doi tuong
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
        res.setError("Validate exception");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseDTO<Object>> customExceptionHandler(CustomException ex) {
        ResponseDTO<Object> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setError("Exception");
        res.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(AnonymousUserException.class)
    public ResponseEntity<ResponseDTO<Object>> anonymousUserExceptionHandler(AnonymousUserException ex) {
        ResponseDTO<Object> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.setError("Anonymous user");
        res.setMessage("Token not found");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
    }

    @ExceptionHandler(NoRightPermissionException.class)
    public ResponseEntity<ResponseDTO<Object>> noRightPermissionExceptionHandler(AnonymousUserException ex) {
        ResponseDTO<Object> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.FORBIDDEN.value());
        res.setError("No right permission exception");
        res.setMessage("User don't have permission");

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }

    // bắt những lỗi hibernate như unique=true
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ResponseDTO<Object>> dataIntegrityViolationExceptionHandler(
            ConstraintViolationException ex) {
        ResponseDTO<Object> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.BAD_REQUEST.value());
        res.setError("Exception");
        res.setMessage("Data Integrity Violation");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}
