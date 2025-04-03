package com.vlearning.KLTN_final.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
public class PayOSConfig {

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @Bean
    public PayOS payOS() {
        PayOS payOS = new PayOS(clientId, apiKey, checksumKey);
        // Có thể thêm các cấu hình khác ở đây nếu cần
        return payOS;
    }
}