package com.vlearning.KLTN_final.domain;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.validator.Require;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    @JsonIgnoreProperties(value = { "email", "password", "role", "fullName", "bio", "avatar", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "createdAt",
            "updatedAt" })
    @Require(message = "Requires buyer")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties(value = { "description", "price", "status",
            "fields", "skills", "active", "createdAt", "updatedAt" })
    @Require(message = "Requires course")
    private Course course;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Long orderCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        // gán thời gian hiện tại
        this.createdAt = Instant.now();
        this.setStatus(OrderStatus.PENDING);
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        // gán thời gian hiện tại
        this.updatedAt = Instant.now();
    }
}
