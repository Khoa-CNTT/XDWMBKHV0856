package com.vlearning.KLTN_final.domain;

import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "lectures_process")
@Data
@Builder
public class LectureProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties(value = { "password", "role", "fullName", "bio", "avatar", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "createdAt",
            "updatedAt" })
    @NotNull(message = "Requires user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "lecture_id")
    @JsonIgnoreProperties(value = { "file", "chapter", "createdAt", "updatedAt" })
    @NotNull(message = "Requires user")
    private Lecture lecture;

    private Boolean done;
}
