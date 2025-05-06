package com.vlearning.KLTN_final.configuration;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;

/* Khi một yêu cầu không có token hoặc token không hợp lệ,
Spring sẽ gọi AuthenticationEntryPoint để xử lý phản hồi cho client */
//handle lỗi 401, truyền sai token

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();

    // hỗ trợ chuyển data -> object
    @Autowired
    private ObjectMapper mapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        // để chương trình chạy mặc định trước, mặc định sẽ không trả về body
        this.delegate.commence(request, response, authException);

        // set kiểu data dưới dạng UTF-8, hỗ trợ tiếng Việt
        response.setContentType("application/json;charset=UTF-8");

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.UNAUTHORIZED.value());

        // lấy message lỗi không truyền token + lỗi token sai
        String errorMessage = Optional.ofNullable(authException.getCause()) // kiểm tra authException.getCause()
                .map(Throwable::getMessage) // nếu authException.getCause() khác null
                .orElse(authException.getMessage()); // nếu authException.getCause() == null

        res.setError(errorMessage);

        res.setMessage("Authentication failed");

        // truyền lại data cho phía client
        mapper.writeValue(response.getWriter(), res);
    }

}
