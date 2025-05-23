package com.vlearning.KLTN_final.util.constant;

public enum BankCode {

    VCB(970436), // Vietcombank
    VTB(970415), // VietinBank
    TCB(970407), // Techcombank
    BIDV(970418), // BIDV
    MB(970422), // MB
    VPB(970432), // Vpbank
    ACB(970416), // ACB
    TPB(970423), // Tpbank
    VIB(970441), // VIB
    VARB(970405), // Agribank
    SHB(970443), // SH(SG-HN) bank
    OCB(970448); // NH phương đông

    private final Integer code;

    BankCode(Integer code) {
        this.code = code;
    }

    public Integer getValue() {
        return code;
    }
}
