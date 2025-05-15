package com.vlearning.KLTN_final.controller;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.request.RegisterReq;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/v1")
public class EmailController {

        @Autowired
        private EmailService emailService;

        @Value("${verify-code-validity-in-seconds}")
        private Long codeExpireTime;

        @PostMapping("/email/register")
        public ResponseEntity<ResponseDTO<Object>> sendEmailRegister(@RequestBody @Valid RegisterReq userRegister)
                        throws InterruptedException, ExecutionException {

                CompletableFuture<String> future = this.emailService.sendEmailFromTemplateSync(
                                userRegister.getLoginName(),
                                "Xác thực đăng ký để bắt đầu sử dụng VLearning", "register",
                                userRegister.getLoginName());

                String encoded = future.get();

                ResponseCookie responseCookie = ResponseCookie.from("code", encoded)
                                .httpOnly(false)
                                .secure(false)
                                .path("/")
                                .maxAge(codeExpireTime)
                                .build();

                ResponseDTO<Object> res = new ResponseDTO<>();
                res.setStatus(HttpStatus.OK.value());
                res.setMessage("Send email verify success");

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(res);
        }

        @PostMapping("/email/verify")
        public ResponseEntity<ResponseDTO<Object>> sendEmailVerify(@RequestBody User user)
                        throws InterruptedException, ExecutionException {

                CompletableFuture<String> future = this.emailService.sendEmailFromTemplateSync(
                                user.getEmail(),
                                "Xác thực để thay đổi mật khẩu cho tài khoản của bạn", "register",
                                user.getEmail());

                String encoded = future.get();

                ResponseCookie responseCookie = ResponseCookie.from("code", encoded)
                                .httpOnly(false)
                                .secure(false)
                                .path("/")
                                .maxAge(codeExpireTime)
                                .build();

                ResponseDTO<Object> res = new ResponseDTO<>();
                res.setStatus(HttpStatus.OK.value());
                res.setMessage("Send email verify success");

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(res);
        }

}
