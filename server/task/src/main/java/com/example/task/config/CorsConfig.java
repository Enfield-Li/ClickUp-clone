package com.example.task.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // registry
        //     .addMapping("/**")
        //     .allowCredentials(true)
        //     .allowedMethods("PUT", "DELETE", "GET", "POST", "OPTIONS")
        //     .allowedOrigins("http://localhost:3000");
    }
}
