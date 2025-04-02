package com.vlearning.KLTN_final.domain.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LoginReq {

    @NotBlank(message = "Loginame can not be blank")
    private String loginName;

    @NotBlank(message = "Password can not be blank")
    private String password;

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
