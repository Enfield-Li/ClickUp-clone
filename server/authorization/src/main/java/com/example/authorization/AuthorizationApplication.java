package com.example.authorization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// @EnableEurekaClient
@SpringBootApplication(scanBasePackages = {
        "com.example.amqp",
        "com.example.clients",
        "com.example.serviceConfig",
        "com.example.authorization",
        "com.example.serviceExceptionHandling",
})
public class AuthorizationApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthorizationApplication.class, args);
    }
}
