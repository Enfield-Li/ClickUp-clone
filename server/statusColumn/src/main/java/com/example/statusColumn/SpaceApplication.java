package com.example.statusColumn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// import org.springframework.cloud.openfeign.EnableFeignClients;

// @EnableEurekaClient
// @EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(scanBasePackages = {
        "com.example.amqp",
        "com.example.clients",
        "com.example.statusColumn",
        "com.example.serviceSecurityConfig",
})
public class SpaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpaceApplication.class, args);
    }
}
