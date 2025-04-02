package com.vlearning.KLTN_final.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private PasswordEncoder encoder;

    public User handleCreateUser(User user) throws CustomException {

        if (this.userRepository.findByEmail(user.getEmail()) != null) {
            throw new CustomException("User exist already!");
        }

        String passwordEncoded = encoder.encode(user.getPassword());
        user.setPassword(passwordEncoded);

        return this.userRepository.save(user);
    }

    public User handleFetchUser(Long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        return this.userRepository.findById(id).isPresent() ? this.userRepository.findById(id).get() : null;
    }

    public User handleGetUserByUsername(String username) throws CustomException {
        if (this.userRepository.findByEmail(username) == null) {
            throw new CustomException("User not found");
        }
        return this.userRepository.findByEmail(username);
    }

    public ResultPagination handleFetchSeveralUser(Specification<User> spec, Pageable pageable) {

        Page<User> page = this.userRepository.findAll(spec, pageable);

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

    public void handleDeleteUser(Long id) throws CustomException, IOException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        this.userRepository.deleteById(id);
    }

    public User handleUpdateUser(User user) throws CustomException {
        User userDB = this.handleFetchUser(user.getId());

        // role
        if (user.getRole() != null) {
            userDB.setRole(user.getRole());
        }

        // full name
        if (user.getFullName() != null && !user.getFullName().equals("")) {
            userDB.setFullName(user.getFullName());
        }

        // bio
        if (user.getBio() != null && !user.getBio().equals("")) {
            userDB.setBio(user.getBio());
        }

        // avatar
        if (user.getAvatar() != null && !user.getAvatar().equals("")) {
            userDB.setAvatar(user.getAvatar());
        }

        // background
        if (user.getBackground() != null && !user.getBackground().equals("")) {
            userDB.setBackground(user.getBackground());
        }

        // address
        if (user.getAddress() != null && !user.getAddress().equals("")) {
            userDB.setAddress(user.getAddress());
        }

        // phone
        if (user.getPhone() != null && !user.getPhone().equals("")) {
            userDB.setPhone(user.getPhone());
        }

        return this.userRepository.save(userDB);
    }

    // update active
    public User handleUpdateActiveUser(long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        user.setActive(!user.isActive());

        return this.userRepository.save(user);
    }

    // update protect
    public User handleUpdateProtectUser(long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        user.setProtect(!user.isProtect());

        return this.userRepository.save(user);
    }

    public User handleUpdateUserImage(String entity, long id, MultipartFile file) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        if (entity.equals("avatar")) {
            user.setAvatar(this.fileService.uploadFile(file, entity, id));
        } else if (entity.equals("background")) {
            user.setBackground(this.fileService.uploadFile(file, entity, id));
        } else {
            throw new CustomException("Wrong entity");
        }

        return this.userRepository.save(user);
    }

    public void handleDeleteSeveralUsers(Long[] users) {
        for (Long id : users) {
            if (this.userRepository.findById(id).isPresent()) {
                this.userRepository.deleteById(id);
            }
        }
    }
}
