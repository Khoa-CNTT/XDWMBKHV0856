package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.util.constant.DiscountType;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public Coupon handleCreateCoupon(Coupon coupon) throws CustomException {

        if (coupon.getDiscountType().equals(DiscountType.FIXED)) {
            if (coupon.getValue() < 1000) {
                throw new CustomException("Value must be greater than 1000VND");
            }
        } else if (coupon.getDiscountType().equals(DiscountType.PERCENT)) {
            if (coupon.getValue() < 1 || coupon.getValue() > 100) {
                throw new CustomException("Value must be from 1% to 100%");
            }
        }

        return this.couponRepository.save(coupon);
    }

    public Coupon handleFetchCoupon(Long id) throws CustomException {
        if (!this.couponRepository.findById(id).isPresent()) {
            throw new CustomException("Coupon not found");
        }

        return this.couponRepository.findById(id).get();
    }

    public ResultPagination handleFetchSeveralCoupons(Specification<Coupon> spec, Pageable pageable) {
        Page<Coupon> page = this.couponRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(page.getContent());
        resultPagination.setMeta(meta);

        return resultPagination;
    }

    public void handleDeleteCoupon(Long id) throws CustomException {
        if (!this.couponRepository.findById(id).isPresent()) {
            throw new CustomException("Coupon not found");
        }

        Coupon coupon = this.couponRepository.findById(id).get();
        if (coupon.getHeadCode().equals("FREE")
                || coupon.getHeadCode().equals("60CASHNEWUSER")
                || coupon.getHeadCode().equals("5PERCENTMONTHLY")) {
            throw new CustomException("Can't delete this coupon");
        }

        this.couponRepository.deleteById(id);
    }

    public Coupon handleUpdateCoupon(Coupon coupon) throws CustomException {
        Coupon couponDB = this.handleFetchCoupon(coupon.getId());

        if (couponDB.getHeadCode().equals("FREE")
                || couponDB.getHeadCode().equals("60CASHNEWUSER")
                || couponDB.getHeadCode().equals("5PERCENTMONTHLY")) {
            throw new CustomException("Can't edit this coupon");
        } else {
            if (coupon.getHeadCode() != null && !coupon.getHeadCode().equals("")) {
                couponDB.setHeadCode(coupon.getHeadCode());
            }

            if (coupon.getDescription() != null && !coupon.getDescription().equals("")) {
                couponDB.setDescription(coupon.getDescription());
            }

            if (coupon.getDiscountType() != null) {
                couponDB.setDiscountType(coupon.getDiscountType());
            }

            if (coupon.getValue() != null) {
                if (couponDB.getDiscountType().equals(DiscountType.FIXED)) {
                    if (coupon.getValue() < 1000) {
                        throw new CustomException("Value must be greater than 1000VND");
                    }
                } else if (couponDB.getDiscountType().equals(DiscountType.PERCENT)) {
                    if (coupon.getValue() < 1 || coupon.getValue() > 100) {
                        throw new CustomException("Value must be from 1% to 100%");
                    }
                }

                couponDB.setValue(coupon.getValue());
            }

            if (coupon.getDayDuration() != null && coupon.getDayDuration() > 0) {
                couponDB.setDayDuration(coupon.getDayDuration());
            }

            return this.couponRepository.save(couponDB);
        }
    }

    // @Scheduled(cron = "0 0 0 * * ?") // Chạy lúc 00:00 mỗi ngày
    // // @Scheduled(cron = "0 * * * * ?")
    // @Transactional
    // public void autoRemoveExpiredCoupons() {
    // Instant now = Instant.now();
    // couponRepository.deleteByExpiresAtBefore(now);
    // System.out.println(">>>>>>>>>>>>>> DELETE EXPIRED COUPONS");
    // }
}
