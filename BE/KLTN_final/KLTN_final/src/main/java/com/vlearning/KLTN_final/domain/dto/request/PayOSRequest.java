package com.vlearning.KLTN_final.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
public class PayOSRequest {
    String orderCode;
    Double amount;
    String description;
}
