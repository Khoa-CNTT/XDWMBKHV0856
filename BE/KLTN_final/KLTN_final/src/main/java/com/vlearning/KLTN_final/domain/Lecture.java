package com.vlearning.KLTN_final.domain;

import java.io.IOException;
import java.time.Instant;

import org.springframework.context.ApplicationContext;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.configuration.ApplicationContextProvider;
import com.vlearning.KLTN_final.service.FileService;
import com.vlearning.KLTN_final.util.exception.CustomException;
import com.vlearning.KLTN_final.util.validator.Require;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lectures")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Lecture's title can not be blank")
    private String title;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String file;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    @JsonIgnoreProperties(value = { "course", "lectures" })
    @Require(message = "Requires chapter")
    private Chapter chapter;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    // Hàm xử lý trước khi tạo
    @PrePersist
    public void handleBeforeCreate() throws CustomException {
        this.createdAt = Instant.now();
    }

    // Hàm xử lý trước khi cập nhật
    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }

    @PostPersist
    public void handleAfterCreate() throws CustomException {
        /*
         * context.getBean(FileService.class) là cách lấy Bean đã được Spring quản lý.
         * Nó giúp tránh các lỗi null, dependency injection, và quản lý vòng đời đối
         * tượng một cách tự động
         */
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();
        FileService fileService = context.getBean(FileService.class);
        fileService.createFolder("lecture", this.getId());
    }

    @PreRemove
    private void handleBeforeRemove() throws IOException {
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();
        FileService fileService = context.getBean(FileService.class);
        fileService.deleteFolder("lecture", this.getId());
    }
}
