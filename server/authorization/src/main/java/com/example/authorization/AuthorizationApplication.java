package com.example.authorization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// @EnableEurekaClient
@SpringBootApplication(scanBasePackages = { "com.example.authorization",
        "com.example.clients",
        "com.example.serviceCORS" })
public class AuthorizationApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthorizationApplication.class, args);
    }
}
