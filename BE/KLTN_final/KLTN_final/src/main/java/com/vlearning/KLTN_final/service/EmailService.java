package com.vlearning.KLTN_final.service;

import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.concurrent.Future;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private SpringTemplateEngine springTemplateEngine;

    @Autowired
    private PasswordEncoder encoder;

    // gửi email đồng bộ (Synchronize)
    public void sendEmailSync(String to, String subject, String content, boolean isMultipart, boolean isHtml) {

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();

        // isMultipart: gửi kèm hình ảnh, file,... hay không
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            // người nhận
            message.setTo(to);

            // nội dung
            message.setSubject(subject);

            // nội dung mail: nếu isHtml == true thì nội dung sẽ là dưới dạng html
            message.setText(content, isHtml);

            this.javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    @Async
    public Future<String> sendEmailVerifyFromTemplateSync(String to, String subject, String templateName, String username) {
        Context context = new Context();
        Random rand = new Random();

        context.setVariable("name", username);
        // tạo code ngẫu nhiên 5 chữ số
        int code = rand.nextInt(100000);
        while (code <= 9999) {
            code = rand.nextInt(100000);
        }
        context.setVariable("code", code);

        // TemplateEngine convert từ file html -> text , cần thiết tên của file html và
        // context
        String content = this.springTemplateEngine.process(templateName, context);

        this.sendEmailSync(to, subject, content, false, true);

        // trả về mã đã encode
        return new AsyncResult<>(this.encoder.encode(code + ""));
    }
}
