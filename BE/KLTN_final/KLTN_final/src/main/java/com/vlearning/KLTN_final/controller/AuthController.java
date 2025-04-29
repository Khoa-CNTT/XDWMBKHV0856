package com.vlearning.KLTN_final.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.LoginReq;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.UserAuth;
import com.vlearning.KLTN_final.service.UserService;
import com.vlearning.KLTN_final.util.exception.CustomException;
import com.vlearning.KLTN_final.util.security.SecurityUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1")
public class AuthController {

        @Autowired
        private AuthenticationManagerBuilder authenticationManagerBuilder;

        @Autowired
        private SecurityUtil securityUtil;

        @Autowired
        private UserService userService;

        @PostMapping("/login")
        public ResponseEntity<ResponseDTO<String>> login(@RequestBody @Valid LoginReq userLogin)
                        throws CustomException {

                // Nạp input gồm username/password vào Security
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userLogin.getLoginName(), userLogin.getPassword());

                // xác thực người dùng
                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);

                // lưu thông tin vào context
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // response custom
                User user = this.userService.handleGetUserByUsername(userLogin.getLoginName());

                UserAuth responseUser = new UserAuth(
                                user.getId(),
                                user.getEmail(),
                                user.getRole().getRoleValue(),
                                user.getFullName(),
                                user.getAvatar(),
                                user.getBackground(),
                                user.getAddress(),
                                user.getPhone());

                // create a token
                // truyền vào thông tin đăng nhập của người dùng để lấy token
                String accessToken = this.securityUtil.createAccessToken(responseUser);
                ResponseDTO<String> res = new ResponseDTO<>();
                res.setStatus(HttpStatus.OK.value());
                res.setMessage("Login success");
                res.setData(accessToken);

                return ResponseEntity.ok(res);
        }

        // Nếu FE gọi API về backend (localhost:8080) và gửi kèm cookie (bằng cách dùng
        // credentials: "include" trong fetch/axios), backend sẽ nhận được session cũ.
        // Spring Security sẽ lấy lại authentication context từ session, và bạn vẫn lấy
        // được thông tin Google (email, name, ...).
        @GetMapping("/login/google")
        public ResponseEntity<ResponseDTO<String>> getLoginInfo(HttpServletResponse response,
                        @AuthenticationPrincipal OAuth2User principal)
                        throws CustomException, IOException {
                if (principal == null) {
                        // response.sendRedirect("http://localhost:8080");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }

                String email = principal.getAttribute("email");
                // Lấy user từ DB (nếu chưa có thì tạo mới)
                User user = this.userService.handleGetUserByUsername(email);

                UserAuth responseUser = new UserAuth(
                                user.getId(),
                                user.getEmail(),
                                user.getRole().getRoleValue(),
                                user.getFullName(),
                                user.getAvatar(),
                                user.getBackground(),
                                user.getAddress(),
                                user.getPhone());
                // Tạo JWT
                String accessToken = this.securityUtil.createAccessToken(responseUser);

                ResponseDTO<String> res = new ResponseDTO<>();
                res.setStatus(HttpStatus.OK.value());
                res.setMessage("Login with Google success");
                res.setData(accessToken);

                // // Redirect về FE kèm token
                // response.sendRedirect("http://localhost:3000/login-success?token=" +
                // accessToken);

                return ResponseEntity.ok(res);
        }

        // phải truyền token thì mới lấy được data, đó là "owner" của token
        @GetMapping("/account")
        public ResponseEntity<ResponseDTO<UserAuth>> getAccount() throws CustomException {

                String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get()
                                : "";

                User user = this.userService.handleGetUserByUsername(email);

                UserAuth responseUser = new UserAuth(
                                user.getId(),
                                user.getEmail(),
                                user.getRole().getRoleValue(),
                                user.getFullName(),
                                user.getAvatar(),
                                user.getBackground(),
                                user.getAddress(),
                                user.getPhone());

                ResponseDTO<UserAuth> res = new ResponseDTO<>();
                res.setStatus(HttpStatus.OK.value());
                res.setMessage("Get login account success");
                res.setData(responseUser);

                return ResponseEntity.ok().body(res);
        }

}
