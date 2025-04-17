package com.vlearning.KLTN_final.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;
import com.vlearning.KLTN_final.domain.Order;
import com.vlearning.KLTN_final.domain.dto.request.CreateSeveralOrdersReq;
import com.vlearning.KLTN_final.domain.dto.response.OrderResponse;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.service.OrderService;
import com.vlearning.KLTN_final.util.exception.CustomException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/v1")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<ResponseDTO<List<Order>>> createOrder(@RequestBody CreateSeveralOrdersReq req)
            throws CustomException {

        ResponseDTO<List<Order>> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create several orders success");
        res.setData(this.orderService.handleCreateSeveralOrders(req));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<ResponseDTO<OrderResponse>> fetchOrder(@PathVariable Long id) throws CustomException {

        ResponseDTO<OrderResponse> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch order success");
        res.setData(this.orderService.handleFetchOrder(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/orders")
    public ResponseEntity<ResponseDTO<ResultPagination>> fetchOrders(@Filter Specification<Order> spec,
            Pageable pageable) {

        ResponseDTO<ResultPagination> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch several orders success");
        res.setData(this.orderService.handleFetchSeveralOrders(spec, pageable));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

}
