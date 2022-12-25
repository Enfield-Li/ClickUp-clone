package com.example.authorization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// @EnableEurekaClient
@SpringBootApplication(scanBasePackages = {
        "com.example.clients",
        "com.example.serviceConfig",
        "com.example.authorization",
})
public class AuthorizationApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthorizationApplication.class, args);
    }
}
