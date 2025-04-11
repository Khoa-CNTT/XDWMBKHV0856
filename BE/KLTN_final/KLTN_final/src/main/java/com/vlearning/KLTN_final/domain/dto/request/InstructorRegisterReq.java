package com.vlearning.KLTN_final.domain.dto.request;

import com.vlearning.KLTN_final.util.constant.BankCode;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class InstructorRegisterReq {

    @NotNull(message = "Id cannot be null")
    private Long id;

    @NotBlank(message = "Fullname cannot be blank")
    private String fullName;

    @NotBlank(message = "Bio cannot be blank")
    private String bio;

    @NotBlank(message = "Address cannot be blank")
    private String address;

    @NotBlank(message = "Phone cannot be blank")
    private String phone;

    @NotNull(message = "Requires bank")
    private BankInformation bankInformation;

    @Getter
    @Setter
    @Valid
    public static class BankInformation {

        @Enumerated(EnumType.STRING)
        @NotNull(message = "Bank code cannot be blank")
        private BankCode bank;

        @NotBlank(message = "Account cannot be blank")
        private String account;
    }
}
