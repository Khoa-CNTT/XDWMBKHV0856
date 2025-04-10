package com.vlearning.KLTN_final.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.UserCoupon;
import com.vlearning.KLTN_final.domain.dto.request.ReleaseCouponReq;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.repository.UserCouponRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.DiscountType;
import com.vlearning.KLTN_final.util.constant.RoleEnum;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.transaction.Transactional;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCouponRepository userCouponRepository;

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

    public void handleReleaseCoupon(ReleaseCouponReq req) throws CustomException {
        if (!this.couponRepository.findById(req.getCoupon().getId()).isPresent()) {
            throw new CustomException("Coupon not found");
        }

        Coupon coupon = this.couponRepository.findById(req.getCoupon().getId()).get();

        for (User user : req.getUsers()) {
            if (this.userRepository.findById(user.getId()).isPresent()) {
                user = this.userRepository.findById(user.getId()).get();
                UserCoupon uCoupon = new UserCoupon();
                uCoupon.setCoupon(coupon);
                uCoupon.setUser(user);
                this.userCouponRepository.save(uCoupon);
            }
        }

    }

    public List<UserCoupon> handleFetchUserCouponByUserId(Long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        return this.userCouponRepository.findAllByUserId(id);
    }

    @Scheduled(cron = "0 0/60 * * * ?")
    @Async
    public void autoRemoveExpiredCoupons() {
        Instant now = Instant.now();
        List<UserCoupon> uCoupons = this.userCouponRepository.findAllByExpiresAtBefore(now);
        this.userCouponRepository.deleteAll(uCoupons);
        System.out.println(">>>>>>>>>>>>>> DELETE EXPIRED COUPONS SUCCESS: " + LocalDateTime.now());
    }

    // @Scheduled(cron = "0 0/3 * * * ?")
    @Scheduled(cron = "0 0 0 1 * ?")
    @Async
    public void monthlyCouponRelease() throws CustomException {
        List<User> users = this.userRepository.findAllByRole(RoleEnum.STUDENT);
        List<User> intructors = this.userRepository.findAllByRole(RoleEnum.INSTRUCTOR);
        users.addAll(intructors);
        this.handleReleaseCoupon(new ReleaseCouponReq(this.couponRepository.findByHeadCode("5PERCENTMONTHLY"), users));
        System.out.println(">>>>>>>>>>>>>> MONTHLY RELEASE COUPON 5PERCENTMONTHLY SUCCESS: " + LocalDateTime.now());
    }
}
