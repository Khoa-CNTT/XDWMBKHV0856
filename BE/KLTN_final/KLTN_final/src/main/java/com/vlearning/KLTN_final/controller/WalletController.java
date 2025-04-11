package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vlearning.KLTN_final.domain.Wallet;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.WalletService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/v1")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/wallet/{id}")
    public ResponseEntity<ResponseDTO<Wallet>> fetchWallet(@PathVariable Long id) throws CustomException {

        ResponseDTO<Wallet> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch wallet success");
        res.setData(this.walletService.handleFetchWallet(id));

        return ResponseEntity.ok().body(res);
    }

}
