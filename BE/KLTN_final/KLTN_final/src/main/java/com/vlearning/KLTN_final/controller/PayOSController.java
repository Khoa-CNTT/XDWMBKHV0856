package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wallet;
import com.vlearning.KLTN_final.domain.dto.request.MultipleCheckoutReq;
import com.vlearning.KLTN_final.domain.dto.request.PayOSWebhookRequest;
import com.vlearning.KLTN_final.domain.dto.request.SingleCheckoutReq;
import com.vlearning.KLTN_final.domain.dto.response.PayOSResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.WalletRepository;
import com.vlearning.KLTN_final.service.PayOSService;
import com.vlearning.KLTN_final.service.WishlistService;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.exception.CustomException;
import jakarta.validation.Valid;
import vn.payos.PayOS;
import vn.payos.type.PaymentLinkData;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/v1")
public class PayOSController {

    @Autowired
    private PayOSService payOSService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PayOS payOS;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/payos/single-checkout")
    public ResponseEntity<ResponseDTO<PayOSResponse>> msinglePayOSCheckout(
            @RequestBody @Valid SingleCheckoutReq request)
            throws CustomException {

        ResponseDTO<PayOSResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Checkout created");
        res.setData(this.payOSService.createPayment(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/payos/multiple-checkout")
    public ResponseEntity<ResponseDTO<PayOSResponse>> multiplePayOSCheckout(
            @RequestBody @Valid MultipleCheckoutReq request)
            throws CustomException {

        ResponseDTO<PayOSResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Checkout created");
        res.setData(this.payOSService.createPayment(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/payos/transfer_handler")
    public void payosTransferHandler(@RequestBody(required = false) PayOSWebhookRequest request) throws Exception {

        List<Order> orders = this.orderRepository.findAllByOrderCode(request.getData().getOrderCode());
        if (request.getData().getCode().equals("00")) {
            if (!orders.get(0).getStatus().equals(OrderStatus.PAID)) {
                // them tien course owner
                if (orders.size() == 1) {
                    PaymentLinkData payosOrder = payOS.getPaymentLinkInformation(orders.get(0).getOrderCode());
                    User owner = orders.get(0).getCourse().getOwner();
                    Wallet wallet = owner.getWallet();

                    // chiet khau 10%
                    Integer amount = (int) Math.round((payosOrder.getAmountPaid() * 0.9));

                    wallet.setBalance(wallet.getBalance() + amount);
                    this.walletRepository.save(wallet);

                    // remove from wishlist
                    this.wishlistService.handleRemoveCourseFromWishlist(orders.get(0).getBuyer().getWishlist().getId(),
                            orders.get(0).getCourse().getId());
                } else if (orders.size() > 1) {
                    for (Order order : orders) {
                        User owner = order.getCourse().getOwner();
                        Wallet wallet = owner.getWallet();
                        Integer amount = (int) Math.round((order.getCourse().getPrice() * 0.9));
                        wallet.setBalance(wallet.getBalance() + amount);
                        this.walletRepository.save(wallet);

                        // remove from wishlist
                        this.wishlistService.handleRemoveCourseFromWishlist(
                                order.getBuyer().getWishlist().getId(),
                                order.getCourse().getId());
                    }
                }

                orders.forEach(order -> order.setStatus(OrderStatus.PAID));
                this.orderRepository.saveAll(orders);
            }
        }
    }

}
