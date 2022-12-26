package com.example.team;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// @EnableEurekaClient
@EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(scanBasePackages = {
        // "com.example.amqp",
        "com.example.team",
        "com.example.clients",
        "com.example.serviceConfig",
        "com.example.serviceExceptionHandling",
// "com.example.serviceSecurityConfig",
})
public class TeamApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamApplication.class, args);
    }
}
