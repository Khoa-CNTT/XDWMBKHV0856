package com.vlearning.KLTN_final.domain.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class VietQRRes {

    String code;

    String desc;

    Data data;

    @Getter
    @Setter
    public static class Data {
        // bin ngan hang
        Integer acqId;

        // ten stk
        String accountName;

        String qrCode;

        String qrDataURL;
    }
}
