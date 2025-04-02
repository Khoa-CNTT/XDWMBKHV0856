package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.UserService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/v1")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user")
    public ResponseEntity<ResponseDTO<User>> createUser(@RequestBody @Valid User user) throws CustomException {

        ResponseDTO<User> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create user success");
        res.setData(this.userService.handleCreateUser(user));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ResponseDTO<User>> fetchUser(@PathVariable Long id) throws CustomException {
        ResponseDTO<User> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch user success");
        res.setData(this.userService.handleFetchUser(id));

        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/users")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralUsers(@Filter Specification<User> spec,
            Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Complete fetch several users");
        res.setData(this.userService.handleFetchSeveralUser(spec, pageable));

        return ResponseEntity.ok().body(res);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteUser(@PathVariable Long id) throws CustomException, IOException {

        this.userService.handleDeleteUser(id);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Complete delete user");

        return ResponseEntity.ok().body(res);
    }

    @DeleteMapping("/users")
    public ResponseEntity<ResponseDTO<Object>> deleteSeveralUsers(@RequestBody Long[] users)
            throws CustomException, IOException {

        this.userService.handleDeleteSeveralUsers(users);

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Complete delete several users");

        return ResponseEntity.ok().body(res);
    }

    @PutMapping("/user")
    public ResponseEntity<ResponseDTO<User>> updateUser(@RequestBody User user) throws CustomException {
        ResponseDTO<User> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update user success");
        res.setData(this.userService.handleUpdateUser(user));

        return ResponseEntity.ok().body(res);
    }

    @PatchMapping("/user.active/{id}")
    public ResponseEntity<ResponseDTO<User>> updateActiveUser(@PathVariable long id) throws CustomException {
        ResponseDTO<User> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update user success");
        res.setData(this.userService.handleUpdateActiveUser(id));

        return ResponseEntity.ok().body(res);
    }

    @PatchMapping("/user.protect/{id}")
    public ResponseEntity<ResponseDTO<User>> updateProtectUser(@PathVariable long id) throws CustomException {
        ResponseDTO<User> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update user success");
        res.setData(this.userService.handleUpdateProtectUser(id));

        return ResponseEntity.ok().body(res);
    }

    @PatchMapping("/user.{entity}/{id}")
    public ResponseEntity<ResponseDTO<User>> updateUserImage(
            @PathVariable(name = "entity") String entity,
            @PathVariable(name = "id") long id,
            @RequestParam("file") MultipartFile file) throws CustomException {
        ResponseDTO<User> res = new ResponseDTO<>();

        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update user success");
        res.setData(this.userService.handleUpdateUserImage(entity, id, file));

        return ResponseEntity.ok().body(res);
    }

}
