package com.example.serviceCORS;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;

@Configuration
public class ApplicationConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowCredentials(true)
                .allowedMethods("PUT", "DELETE", "GET", "POST", "OPTIONS")
                .allowedOrigins("http://localhost:3000");
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().components(new Components());
    }
}
