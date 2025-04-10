package com.vlearning.KLTN_final.configuration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.DiscountType;
import com.vlearning.KLTN_final.util.constant.RoleEnum;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CouponRepository couponRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");

        List<User> rootUsers = this.userRepository.findAllByRole(RoleEnum.ROOT);
        if (rootUsers == null || rootUsers.size() == 0) {
            User root = new User();
            root.setEmail("root");
            root.setPassword(passwordEncoder.encode("iamroot"));
            root.setFullName("IAMROOT");
            root.setRole(RoleEnum.ROOT);
            root.setProtect(true);
            this.userRepository.save(root);
        }

        List<Coupon> coupons = new ArrayList<>();

        if (this.couponRepository.findByHeadCode("FREE") == null) {
            Coupon coupon = new Coupon();

            coupon.setHeadCode("FREE");
            coupon.setDescription("Free discount");
            coupon.setDiscountType(DiscountType.PERCENT);
            coupon.setValue(100);
            coupon.setDayDuration(30L);

            coupons.add(coupon);
        }

        if (this.couponRepository.findByHeadCode("5PERCENTMONTHLY") == null) {
            Coupon coupon = new Coupon();

            coupon.setHeadCode("5PERCENTMONTHLY");
            coupon.setDescription("5% discount for you every month");
            coupon.setDiscountType(DiscountType.PERCENT);
            coupon.setValue(5);
            coupon.setDayDuration(10L);

            coupons.add(coupon);
        }

        if (this.couponRepository.findByHeadCode("60CASHNEWUSER") == null) {
            Coupon coupon = new Coupon();

            coupon.setHeadCode("60CASHNEWUSER");
            coupon.setDescription("60000 VND discount for your first stand");
            coupon.setDiscountType(DiscountType.FIXED);
            coupon.setValue(60000);
            coupon.setDayDuration(10L);

            coupons.add(coupon);
        }

        this.couponRepository.saveAll(coupons);
    }

}
