package com.vlearning.KLTN_final.domain.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class BankLookupResponse {
    Integer code;
    Boolean success;
    Data data;
    String msg;

    @Getter
    @Setter
    public static class Data {
        String ownerName;
    }
}
