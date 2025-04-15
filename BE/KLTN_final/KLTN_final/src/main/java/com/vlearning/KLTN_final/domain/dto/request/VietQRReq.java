package com.vlearning.KLTN_final.domain.dto.request;

import org.springframework.beans.factory.annotation.Value;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VietQRReq {

    // stk bank thu huong
    String accountNo;

    // ten stk
    String accountName;

    // bin ngan hang
    Integer acqId;

    // so tien chuyen
    Integer amount;

    // template id lay tu myvietqr
    @Value("xyqhMUX")
    String template;
}
