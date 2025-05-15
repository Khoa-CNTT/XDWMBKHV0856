package com.vlearning.KLTN_final.domain;

import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.util.constant.ObjectTarget;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activity_log")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties(value = { "password", "fullName", "bio", "background", "address", "phone", "active",
            "protect", "fields", "skills", "ownCourses", "wishlist", "orders", "lecturesProcess", "reviews",
            "coupons", "wallet" })
    @NotNull(message = "User can not be null")
    private User user;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Object can not be null")
    private ObjectTarget target;

    @Column(columnDefinition = "MEDIUMTEXT")
    @NotBlank(message = "Description can not be blank")
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }
}
