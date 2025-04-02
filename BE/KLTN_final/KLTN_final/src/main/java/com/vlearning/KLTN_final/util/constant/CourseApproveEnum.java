package com.vlearning.KLTN_final.util.constant;

public enum CourseApproveEnum {
    PENDING("PENDING"), APPROVED("APPROVED"), REJECTED("REJECTED");

    private final String value;

    CourseApproveEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
}
