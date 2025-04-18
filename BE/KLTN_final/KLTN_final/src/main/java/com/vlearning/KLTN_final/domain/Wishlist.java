package com.vlearning.KLTN_final.domain;

import java.io.IOException;
import java.util.Set;

import org.springframework.context.ApplicationContext;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vlearning.KLTN_final.configuration.ApplicationContextProvider;
import com.vlearning.KLTN_final.repository.WishlistRepository;
import com.vlearning.KLTN_final.service.FileService;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Wishlist {

    public Wishlist(User user) {
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
            "createdAt", "updatedAt" })
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "wish_courses", joinColumns = @JoinColumn(name = "wishlist_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
    @JsonIgnoreProperties(value = { "description", "active", "status", "orders", "reviews", "createdAt", "updatedAt" })
    private Set<Course> courses;

    @PreRemove
    private void handleBeforeRemove() throws IOException {
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();

        WishlistRepository wishlistRepository = context.getBean(WishlistRepository.class);
        Wishlist wishlist = this;
        wishlist.setCourses(null);
        wishlistRepository.save(wishlist);
    }
}
