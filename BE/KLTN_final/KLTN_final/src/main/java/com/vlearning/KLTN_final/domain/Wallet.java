package com.vlearning.KLTN_final.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.util.constant.BankCode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wallets")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne()
    // chỉ rõ rằng cột user_id trong bảng wishlist trỏ đến cột id của bảng user
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = { "password", "role", "bio", "avatar", "background", "address",
            "phone", "active", "protect", "wishlist", "fields", "skills", "ownCourses", "orders", "reviews",
            "createdAt", "updatedAt" })
    private User user;

    @Enumerated(EnumType.STRING)
    private BankCode bank;

    private String accountNumber;

    private String accountName;

    // số dư tài khoản
    private Long balance;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<WithdrawRequest> request;

    @PrePersist
    public void handleBeforeCreate() {
        this.balance = 0L;
    }
}
