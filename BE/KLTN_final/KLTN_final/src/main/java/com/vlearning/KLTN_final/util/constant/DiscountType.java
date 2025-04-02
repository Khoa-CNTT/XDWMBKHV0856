package com.vlearning.KLTN_final.util.constant;

// LOẠI GIẢM GIÁ
public enum DiscountType {

    PERCENT("PERCENT"), // Giảm theo %
    FIXED("FIXED"), // Giảm số tiền cố định
    FREE("FREE");

    private final String type;

    DiscountType(String type) {
        this.type = type;
    }

    public String getVoucherType() {
        return type;
    }
}
