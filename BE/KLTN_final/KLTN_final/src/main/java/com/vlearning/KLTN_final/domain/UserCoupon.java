package com.vlearning.KLTN_final.domain;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_coupons")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCoupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "coupon_id")
    @JsonIgnoreProperties(value = { "userCoupon", "discountType", "dayDuration", "createdAt" })
    @NotNull(message = "Coupon can't be null")
    private Coupon coupon;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties(value = { "password", "role", "background", "address",
            "phone", "active", "protect", "fields", "skills", "wishlist", "ownCourses", "orders", "reviews",
            "createdAt", "updatedAt" })
    @NotNull(message = "User can't be null")
    private User user;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    @NotNull(message = "Coupon's expire time is empty")
    private Instant expiresAt;

    @PrePersist
    public void handleBeforeCreate() {
        Instant now = Instant.now();
        Instant expireTime = now.plusSeconds(86400 * this.coupon.getDayDuration());
        this.expiresAt = expireTime;
    }

}
