package com.vlearning.KLTN_final.util.constant;

public enum RoleEnum {
    ROOT("ROOT"), ADMIN("ADMIN"), INSTRUCTOR("INSTRUCTOR"), STUDENT("STUDENT");

    private final String role;

    RoleEnum(String role) {
        this.role = role;
    }

    public String getRoleValue() {
        return role;
    }
}
