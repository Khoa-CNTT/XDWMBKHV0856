package com.vlearning.KLTN_final.domain.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class PayOSWebhookRequest {

    private String code;
    private String desc;
    private Boolean success;
    private Data data;
    private String signature;

    @Getter
    @Setter
    public static class Data {
        private Long orderCode;
        private Integer amount;
        private String description;
        private String accountNumber;
        private String reference;
        private String transactionDateTime;
        private String currency;
        private String paymentLinkId;
        private String code;
        private String desc;
    }
}
