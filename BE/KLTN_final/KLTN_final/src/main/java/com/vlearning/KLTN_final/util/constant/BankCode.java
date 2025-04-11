package com.vlearning.KLTN_final.util.constant;

public enum BankCode {

    VCB("VCB"), // Vietcombank
    VTB("VTB"), // VietinBank
    TCB("TCB"), // Techcombank
    BIDV("BIDV"), // BIDV
    MB("MB"), // MB
    VPB("VPB"), // Vpbank
    ACB("ACB"), // ACB
    TPB("TPB"), // Tpbank
    VIB("VIB"), // VIB
    VARB("VARB"); // Agribank

    private final String code;

    BankCode(String code) {
        this.code = code;
    }

    public String getValue() {
        return code;
    }
}
