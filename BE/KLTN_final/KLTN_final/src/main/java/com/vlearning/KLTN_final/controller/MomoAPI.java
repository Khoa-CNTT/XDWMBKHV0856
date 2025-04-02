package com.vlearning.KLTN_final.controller;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.vlearning.KLTN_final.domain.dto.request.CreateMomoRequest;
import com.vlearning.KLTN_final.domain.dto.response.CreateMomoResponse;

@FeignClient(name = "momo", url = "${momo.endpoint}")
public interface MomoAPI {

    @PostMapping("/create")
    CreateMomoResponse createMomoQR(@RequestBody CreateMomoRequest createMomoRequest);
}
