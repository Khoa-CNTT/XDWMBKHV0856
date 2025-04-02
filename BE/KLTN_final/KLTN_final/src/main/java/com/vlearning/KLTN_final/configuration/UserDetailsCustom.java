package com.vlearning.KLTN_final.configuration;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.vlearning.KLTN_final.service.UserService;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Component("userDetailsService") // ghi đè lại UserDetailsService, vì quy tắc đặt tên của bean nên chữ cái đầu là
                                 // viết thường
public class UserDetailsCustom implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    // query user trong database bằng tham số username truyền vào này
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.vlearning.KLTN_final.domain.User user = null;
        try {
            user = userService.handleGetUserByUsername(username);
        } catch (CustomException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        if (user == null) {
            throw new UsernameNotFoundException("Username/Password invalid");
        }

        if (!user.isActive()) {
            throw new UsernameNotFoundException("User is not available");
        }

        // nếu muốn lưu thêm data của user như avatar,... thì phải kế thừa UserDetails
        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRoleValue())));
    }

}
