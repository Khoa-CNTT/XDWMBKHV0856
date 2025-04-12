package com.vlearning.KLTN_final.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
public class HelloWorldController {

    @GetMapping("/")
    public String main() {
        return "Hello world";
    }

    @PostMapping("/")
    public String post() {
        return "Hello world - post";
    }

}
