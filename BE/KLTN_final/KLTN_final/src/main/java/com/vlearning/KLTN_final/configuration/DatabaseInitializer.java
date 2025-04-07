package com.vlearning.KLTN_final.configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.RoleEnum;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");

        List<User> rootUsers = this.userRepository.findAllByRole(RoleEnum.ROOT);
        if (rootUsers == null || rootUsers.size() == 0) {
            User root = new User();
            root.setEmail("root");
            root.setPassword(passwordEncoder.encode("iamroot"));
            root.setRole(RoleEnum.ROOT);
            root.setProtect(true);
            this.userRepository.save(root);
        }
    }

}
