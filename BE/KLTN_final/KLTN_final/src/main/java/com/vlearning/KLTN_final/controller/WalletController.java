package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.Wallet;
import com.vlearning.KLTN_final.domain.WithdrawRequest;
import com.vlearning.KLTN_final.domain.dto.request.InstructorRegisterReq;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.domain.dto.response.VietQRRes;
import com.vlearning.KLTN_final.service.WalletService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/v1")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/wallet/{id}")
    public ResponseEntity<ResponseDTO<Wallet>> fetchWalletByUserID(@PathVariable Long id) throws CustomException {

        ResponseDTO<Wallet> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch wallet success");
        res.setData(this.walletService.handleFetchWallet(id));

        return ResponseEntity.ok().body(res);
    }

    @PutMapping("/wallet/{id}")
    public ResponseEntity<ResponseDTO<Wallet>> updateWalletBankAccount(@PathVariable Long id,
            @RequestBody @Valid InstructorRegisterReq.BankInformation request) throws CustomException {

        ResponseDTO<Wallet> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update wallet success");
        res.setData(this.walletService.handleUpdateWallet(id, request));

        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/send-withdraw")
    public ResponseEntity<ResponseDTO<WithdrawRequest>> createWithdraw(@RequestBody @Valid WithdrawRequest request)
            throws CustomException {

        ResponseDTO<WithdrawRequest> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Send withdraw request success");
        res.setData(this.walletService.handleSendWithdrawRequest(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/withdraw/{id}")
    public ResponseEntity<ResponseDTO<WithdrawRequest>> fetchWithdraw(@PathVariable Long id) throws CustomException {

        ResponseDTO<WithdrawRequest> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch withdraw request success");
        res.setData(this.walletService.handleFetchWithdraw(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/withdraws")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchSeveralWithdraws(
            @Filter Specification<WithdrawRequest> spec, Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch several withdraws request success");
        res.setData(this.walletService.handleFetchSeveralWithdraw(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PostMapping("/create-withdraw-payment")
    public ResponseEntity<ResponseDTO<VietQRRes>> postMethodName(@RequestBody WithdrawRequest request)
            throws CustomException {

        ResponseDTO<VietQRRes> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create QR success");
        res.setData(this.walletService.createVietQRByWithdrawRequest(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // @PatchMapping()
    // public ResponseEntity<ResponseDTO<WithdrawRequest>>
    // updateWithDrawStatus(@PathVariable Long id) throws CustomException {

    // ResponseDTO<WithdrawRequest> res = new ResponseDTO<>();
    // res.setStatus(HttpStatus.OK.value());
    // res.setMessage("Fetch withdraw request success");
    // res.setData(this.walletService.handleFetchWithdraw(id));

    // return ResponseEntity.status(HttpStatus.OK).body(res);
    // }

}
