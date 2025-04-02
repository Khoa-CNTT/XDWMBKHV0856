package com.vlearning.KLTN_final.domain.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StripeRequest {
    @NotNull(message = "Order's price can not be empty")
    @Min(value = 0, message = "Order's price must be greater than or equal to 0")
    private Long price;

    private String currency;

    private Long[] courses;

    private Long userId;
}
