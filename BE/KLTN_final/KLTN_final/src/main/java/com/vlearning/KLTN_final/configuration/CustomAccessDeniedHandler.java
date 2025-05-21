package com.vlearning.KLTN_final.configuration;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//  custom handle lỗi nếu như role người dùng không có quyền truy cập endpoint
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Autowired
    private ObjectMapper mapper;

    @Override
    public void handle(HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");

        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.FORBIDDEN.value());
        res.setError("Authentication failed");
        res.setMessage("You do not have permission to access this resource");

        mapper.writeValue(response.getWriter(), res);
    }

}
