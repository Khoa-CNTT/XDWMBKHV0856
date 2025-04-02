package com.vlearning.KLTN_final.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAuth {

    private Long id;

    private String email;

    private String role;

    private String fullName;

    private String avatar;

    private String background;

    private String address;

    private String phone;
}
