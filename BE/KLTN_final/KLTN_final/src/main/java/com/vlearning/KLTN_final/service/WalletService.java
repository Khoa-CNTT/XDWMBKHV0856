package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.Wallet;
import com.vlearning.KLTN_final.repository.WalletRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    public Wallet handleFetchWallet(Long id) throws CustomException {
        if (this.walletRepository.findByUserId(id) == null) {
            throw new CustomException("Wallet not found");
        }

        return this.walletRepository.findByUserId(id);
    }
}
