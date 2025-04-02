package com.vlearning.KLTN_final.configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourcesWebConfiguration implements WebMvcConfigurer {

    @Value("${storage-default-path}")
    private String defaultPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        Path storagePath = Paths.get(defaultPath);

        /*
         * mỗi lần truy cập tới http : /storage/ thì chương trình sẽ tự động tìm dữ liệu
         * bên trong đường link basePAth
         */
        registry.addResourceHandler("/storage/**")
                .addResourceLocations("file:///" + storagePath.toAbsolutePath().toString());
    }
}
