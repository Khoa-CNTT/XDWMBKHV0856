package com.vlearning.KLTN_final.domain.dto.response;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PayOSResponse {
    Integer code;
    String desc;
    JsonNode data;
}
