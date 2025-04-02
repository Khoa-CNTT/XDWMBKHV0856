package com.vlearning.KLTN_final.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.vlearning.KLTN_final.domain.Wishlist;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.WishlistService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/v1")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/wishlist")
    public ResponseEntity<ResponseDTO<Wishlist>> addToWishList(
            @RequestParam("wishlistId") Long wishlistId,
            @RequestParam("courseId") Long courseId) throws CustomException {

        ResponseDTO<Wishlist> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Add course to wishlist success");
        res.setData(this.wishlistService.handleAddCourseToWishlist(wishlistId, courseId));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/wishlist/{user_id}")
    public ResponseEntity<ResponseDTO<Wishlist>> fetchWishList(@PathVariable(name = "user_id") Long id)
            throws CustomException {

        ResponseDTO<Wishlist> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Fetch wishlist success");
        res.setData(this.wishlistService.handleFetcjWishlist(id));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PatchMapping("/wishlist")
    public ResponseEntity<ResponseDTO<Wishlist>> removeFromWishList(
            @RequestParam("wishlistId") Long wishlistId,
            @RequestParam("courseId") Long courseId) throws CustomException {

        ResponseDTO<Wishlist> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Remove course from wishlist success");
        res.setData(this.wishlistService.handleRemoveCourseFromWishlist(wishlistId, courseId));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

}
