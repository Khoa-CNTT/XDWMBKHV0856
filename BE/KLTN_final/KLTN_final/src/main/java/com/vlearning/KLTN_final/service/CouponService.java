package com.vlearning.KLTN_final.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public Coupon handleCreateCoupon(Coupon coupon) throws CustomException {

        if (coupon.getStartAt().isAfter(coupon.getExpiresAt())) {
            throw new CustomException("Wrong expire time");
        }

        return this.couponRepository.save(coupon);
    }

    // @Scheduled(cron = "0 0 0 * * ?") // Chạy lúc 00:00 mỗi ngày
    @Scheduled(cron = "0 * * * * ?")
    public void autoEemoveExpiredCoupons() {
        Instant now = Instant.now();
        couponRepository.deleteByExpiresAtBefore(now);
    }
}
