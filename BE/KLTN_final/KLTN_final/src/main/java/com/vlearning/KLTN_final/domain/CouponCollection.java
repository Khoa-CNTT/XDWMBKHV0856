package com.vlearning.KLTN_final.domain;

import java.io.IOException;
import java.util.Set;

import org.springframework.context.ApplicationContext;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.configuration.ApplicationContextProvider;
import com.vlearning.KLTN_final.repository.CouponCollectionRepository;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreRemove;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_coupon_collection")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CouponCollection {

    public CouponCollection(User user) {
        this.user = user;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne()
    // chỉ rõ rằng cột user_id trong bảng wishlist trỏ đến cột id của bảng user
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = { "email", "password", "role", "bio", "avatar", "background", "address",
            "phone", "active", "protect", "wishlist", "fields", "skills", "ownCourses", "orders", "reviews",
            "couponCollection",
            "createdAt", "updatedAt" })
    private User user;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "collection_coupon", joinColumns = @JoinColumn(name = "collection_id"), inverseJoinColumns = @JoinColumn(name = "coupon_id"))
    private Set<Coupon> coupons;

    @PreRemove
    private void handleBeforeRemove() throws IOException {
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();

        CouponCollectionRepository collectionRepo = context.getBean(CouponCollectionRepository.class);
        CouponCollection collection = this;
        collection.setCoupons(null);
        collectionRepo.save(collection);
    }
}
