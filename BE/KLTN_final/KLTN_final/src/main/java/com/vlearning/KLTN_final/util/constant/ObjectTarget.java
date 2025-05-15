package com.vlearning.KLTN_final.util.constant;

public enum ObjectTarget {

    USER("USER"), COURSE("COURSE"), COUPON("COUPON"), WITHDRAW("WITHDRAW"), STUDY("STUDY");

    private final String value;

    ObjectTarget(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
