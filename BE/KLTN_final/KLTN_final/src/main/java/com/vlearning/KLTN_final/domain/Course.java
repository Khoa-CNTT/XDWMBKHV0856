package com.vlearning.KLTN_final.domain;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.springframework.context.ApplicationContext;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.configuration.ApplicationContextProvider;
import com.vlearning.KLTN_final.domain.dto.request.ReleaseCouponReq;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.service.CouponService;
import com.vlearning.KLTN_final.service.FileService;
import com.vlearning.KLTN_final.util.constant.CourseApproveEnum;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;
import com.vlearning.KLTN_final.util.validator.Require;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "courses")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course's title can not be blank")
    private String title;

    @Column(columnDefinition = "MEDIUMTEXT")
    @NotBlank(message = "Description can not be blank")
    private String description;

    private String image;

    @ManyToOne()
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties(value = { "password", "role", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "reviews",
            "createdAt", "updatedAt" })
    @Require(message = "Requires owner")
    private User owner;

    @NotNull(message = "Course's price can not be empty")
    @Min(value = 0, message = "Course's price must be greater than or equal to 0")
    private Double price;

    // chapter
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Chapter> chapters;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "courses_fields", joinColumns = @JoinColumn(name = "course_id"), inverseJoinColumns = @JoinColumn(name = "field_id"))
    @JsonIgnoreProperties(value = { "skills", "users", "courses", "createdAt", "updatedAt" })
    // @Require(message = "Requires Field")
    private List<Field> fields;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "courses_skills", joinColumns = @JoinColumn(name = "course_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    @JsonIgnoreProperties(value = { "field", "users", "courses", "createdAt", "updatedAt" })
    // @Require(message = "Requires skill")
    private List<Skill> skills;

    private boolean active;

    @Enumerated(EnumType.STRING)
    private CourseApproveEnum status;

    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Wishlist> wishlists;

    // orders
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "field", "users", "courses", "createdAt", "updatedAt" })
    private List<Review> reviews;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    @PrePersist
    private void handleBeforeCreate() {
        // gán thời gian hiện tại
        this.createdAt = Instant.now();
        this.setActive(true);
        this.setStatus(CourseApproveEnum.PENDING);
    }

    @PreUpdate
    private void handleBeforeUpdate() {
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
        fileService.createFolder("course", this.id);
    }

    @PreRemove
    private void handleBeforeRemove() throws IOException, CustomException {
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();
        FileService fileService = context.getBean(FileService.class);
        fileService.deleteFolder("course", this.id);

        // free coupon for this course buyer
        OrderRepository orderRepository = context.getBean(OrderRepository.class);
        CouponService couponService = context.getBean(CouponService.class);
        CouponRepository couponRepository = context.getBean(CouponRepository.class);
        List<Order> orders = orderRepository.findAllByCourse(this);
        for (Order order : orders) {
            if (order.getStatus().equals(OrderStatus.PAID))
                couponService.handleReleaseCoupon(
                        new ReleaseCouponReq(couponRepository.findByHeadCode("FREE"), List.of(order.getBuyer())));
        }
    }
}
