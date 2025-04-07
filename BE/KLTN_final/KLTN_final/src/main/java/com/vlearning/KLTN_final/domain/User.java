package com.vlearning.KLTN_final.domain;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vlearning.KLTN_final.configuration.ApplicationContextProvider;
import com.vlearning.KLTN_final.repository.CouponCollectionRepository;
import com.vlearning.KLTN_final.repository.WishlistRepository;
import com.vlearning.KLTN_final.service.FileService;
import com.vlearning.KLTN_final.util.constant.RoleEnum;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String bio;

    private String avatar;

    private String background;

    private String address;

    private String phone;

    private boolean active;

    private boolean protect;

    // private String refreshToken;

    // những lĩnh vực người dùng quan tâm
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "users_fields", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "field_id"))
    @JsonIgnore
    private List<Field> fields;

    // những kĩ năng người dùng quan tâm
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "users_skills", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    @JsonIgnore
    private List<Skill> skills;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Course> ownCourses;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Wishlist wishlist;

    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> reviews;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private CouponCollection couponCollection;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        // gán thời gian hiện tại
        this.createdAt = Instant.now();
        this.setProtect(false);
        this.setActive(true);
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }

    @PostPersist
    public void handleAfterCreate() throws CustomException {
        this.active = true;
        /*
         * context.getBean(FileService.class) là cách lấy Bean đã được Spring quản lý.
         * Nó giúp tránh các lỗi null, dependency injection, và quản lý vòng đời đối
         * tượng một cách tự động
         */
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();
        FileService fileService = context.getBean(FileService.class);
        fileService.createFolder("avatar", this.id);
        fileService.createFolder("background", this.id);

        WishlistRepository wishlistRepository = context.getBean(WishlistRepository.class);
        Wishlist wishlist = new Wishlist(this);
        wishlistRepository.save(wishlist);

        CouponCollectionRepository collectionRepo = context.getBean(CouponCollectionRepository.class);
        CouponCollection collection = new CouponCollection(this);
        collectionRepo.save(collection);

    }

    @PreRemove
    private void handleBeforeRemove() throws IOException {
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();
        FileService fileService = context.getBean(FileService.class);
        fileService.deleteFolder("avatar", this.id);
        fileService.deleteFolder("background", this.id);

    }
}
