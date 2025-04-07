package com.vlearning.KLTN_final.util.constant;

public enum OrderStatus {
    PENDING("PENDING"), PAID("PAID ");

    private final String value;

    OrderStatus(String role) {
        this.value = role;
    }

    public String getValue() {
        return value;
    }
}
