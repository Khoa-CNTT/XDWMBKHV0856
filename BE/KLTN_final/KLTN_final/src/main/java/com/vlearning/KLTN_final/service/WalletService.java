package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wallet;
import com.vlearning.KLTN_final.domain.WithdrawRequest;
import com.vlearning.KLTN_final.domain.dto.request.InstructorRegisterReq.BankInformation;
import com.vlearning.KLTN_final.domain.dto.response.BankLookupResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.WalletRepository;
import com.vlearning.KLTN_final.repository.WithdrawRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WithdrawRepository withdrawRepository;

    @Value("${banklookup.api-key}")
    private String banklookupApiKey;

    @Value("${banklookup.api-secret}")
    private String banklookupApiSecret;

    private final WebClient webClient = WebClient.create();

    public Wallet handleUpdateWallet(Long id, BankInformation request) throws CustomException {
        if (this.walletRepository.findById(id).isPresent()) {
            BankLookupResponse res = this.handleCheckBankAccount(request);

            Wallet wallet = this.walletRepository.findById(id).get();
            wallet.setBank(request.getBank());
            wallet.setAccountName(res.getData().getOwnerName());
            wallet.setAccountNumber(request.getAccount());

            return this.walletRepository.save(wallet);
        } else {
            throw new CustomException("Wallet not found");
        }
    }

    public BankLookupResponse handleCheckBankAccount(BankInformation req) throws CustomException {
        try {
            return webClient.post()
                    .uri("https://api.banklookup.net/api/bank/id-lookup-prod")
                    .header("x-api-key", banklookupApiKey)
                    .header("x-api-secret", banklookupApiSecret)
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(BankLookupResponse.class)
                    .block();
        } catch (Exception e) {
            throw new CustomException("Bank account not found");
        }
    }

    public Wallet handleFetchWallet(Long id) throws CustomException {
        if (this.walletRepository.findByUserId(id) == null) {
            throw new CustomException("Wallet not found");
        }

        return this.walletRepository.findByUserId(id);
    }

    @Transactional
    public WithdrawRequest handleSendWithdrawRequest(WithdrawRequest request) throws CustomException {

        if (!this.walletRepository.findById(request.getWallet().getId()).isPresent()) {
            throw new CustomException("Wallet not found");
        }

        Wallet wallet = this.walletRepository.findById(request.getWallet().getId()).get();
        if (wallet.getBank() != null &&
                wallet.getAccountNumber() != null && !wallet.getAccountNumber().equals("") &&
                wallet.getAccountName() != null && !wallet.getAccountName().equals("")) {

            Long amount = request.getAmount();
            if (amount <= wallet.getBalance()) {

                wallet.setBalance(wallet.getBalance() - amount);
                this.walletRepository.save(wallet);

                request = WithdrawRequest.builder()
                        .amount(amount)
                        .wallet(wallet)
                        .build();

                return this.withdrawRepository.save(request);
            } else {
                throw new CustomException("Amount greater than wallet's balance");
            }
        } else {
            throw new CustomException("Fill your bank account information first");
        }
    }

    public WithdrawRequest handleFetchWithdraw(Long id) throws CustomException {
        if (!this.withdrawRepository.findById(id).isPresent()) {
            throw new CustomException("Withdraw not found");
        }

        return this.withdrawRepository.findById(id).get();
    }

    public ResultPagination handleFetchSeveralWithdraw(Specification<WithdrawRequest> spec, Pageable pageable) {

        Page<WithdrawRequest> page = this.withdrawRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(page.getContent());
        resultPagination.setMeta(meta);

        return resultPagination;
    }
}
