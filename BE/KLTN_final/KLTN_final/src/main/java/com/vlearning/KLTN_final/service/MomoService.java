package com.vlearning.KLTN_final.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.UUID;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.controller.MomoAPI;
import com.vlearning.KLTN_final.domain.dto.request.CreateMomoRequest;
import com.vlearning.KLTN_final.domain.dto.response.CreateMomoResponse;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {

    @Value("${momo.partnerCode}")
    private String PARTNER_CODE;

    @Value("${momo.accessKey}")
    private String ACCESS_KEY;

    @Value("${momo.secretKey}")
    private String SECRET_KEY;

    @Value("${momo.redirectUrl}")
    private String REDIRECT_URL;

    @Value("${momo.ipnUrl}")
    private String IPN_URL;

    @Value(value = "captureWallet")
    private String REQUEST_TYPE;

    @Autowired
    private final MomoAPI momoAPI;

    public CreateMomoResponse createQR() throws CustomException {
        String orderId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toan thanh cong " + orderId;
        String requestId = UUID.randomUUID().toString();
        String extraData = "Khong qua khuyen mai";
        long amount = 10000;

        // Log all parameters
        // log.info("Creating Momo QR with parameters:");
        // log.info("partnerCode: {}", PARTNER_CODE);
        // log.info("accessKey: {}", ACCESS_KEY);
        // log.info("amount: {}", amount);
        // log.info("extraData: {}", extraData);
        // log.info("ipnUrl: {}", IPN_URL);
        // log.info("orderId: {}", orderId);
        // log.info("orderInfo: {}", orderInfo);
        // log.info("redirectUrl: {}", REDIRECT_URL);
        // log.info("requestId: {}", requestId);
        // log.info("requestType: {}", REQUEST_TYPE);

        // Create raw signature exactly as Momo's documentation - parameters in
        // alphabetical order
        String rawSignature = String.format(
                "accessKey=%s&amount=%d&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                ACCESS_KEY, amount, extraData, IPN_URL, orderId, orderInfo, PARTNER_CODE, REDIRECT_URL, requestId,
                REQUEST_TYPE);

        log.info("Raw signature: {}", rawSignature);

        String prettySignature = "";
        try {
            // Generate HMAC-SHA256 directly from raw signature without URL encoding
            prettySignature = signHmacSHA256(rawSignature, SECRET_KEY);
            log.info("Generated signature: {}", prettySignature);
        } catch (Exception e) {
            log.error("Failed to create Momo signature", e);
            throw new CustomException("Failed to create payment signature: " + e.getMessage());
        }

        if (prettySignature.isBlank()) {
            throw new CustomException("Payment failed: Empty signature");
        }

        // URL encode parameters that need encoding for the actual request
        String encodedOrderInfo = URLEncoder.encode(orderInfo, StandardCharsets.UTF_8);
        String encodedExtraData = URLEncoder.encode(extraData, StandardCharsets.UTF_8);

        CreateMomoRequest request = CreateMomoRequest
                .builder()
                .partnerCode(PARTNER_CODE)
                .requestType(REQUEST_TYPE)
                .ipnUrl(IPN_URL)
                .redirectUrl(REDIRECT_URL)
                .orderId(orderId)
                .orderInfo(encodedOrderInfo) // Use encoded version
                .requestId(requestId)
                .extraData(encodedExtraData) // Use encoded version
                .amount(amount)
                .signature(prettySignature)
                .lang("vi")
                .build();

        return momoAPI.createMomoQR(request);
    }

    private String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretkey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretkey);
        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

}
