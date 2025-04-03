package com.vlearning.KLTN_final;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = { "com.vlearning.KLTN_final", "vn.payos" })
@EnableAsync
@EnableScheduling
public class KltnFinalApplication {

	public static void main(String[] args) {
		SpringApplication.run(KltnFinalApplication.class, args);
	}

}
