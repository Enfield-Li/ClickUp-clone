package com.example.teamStatusCategory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableEurekaClient
// @EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(scanBasePackages = {
        "com.example.teamStatusCategory",
        "com.example.amqp",
        "com.example.clients",
        "com.example.serviceConfig",
        "com.example.serviceSecurityConfig",
        "com.example.serviceExceptionHandling",
})
public class StatusCategoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(StatusCategoryApplication.class, args);
    }
}
