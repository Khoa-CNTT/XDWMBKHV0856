package com.vlearning.KLTN_final.domain.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RegisterReq {

    @NotBlank(message = "Fullname can not be blank")
    private String fullName;

    @NotBlank(message = "Loginame can not be blank")
    private String loginName;

    @NotBlank(message = "Password can not be blank")
    private String password;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

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
