package com.vlearning.KLTN_final.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterReq {

    @NotBlank(message = "Fullname can not be blank")
    private String fullName;

    @NotBlank(message = "Loginame can not be blank")
    private String loginName;

    @NotBlank(message = "Password can not be blank")
    private String password;
}
