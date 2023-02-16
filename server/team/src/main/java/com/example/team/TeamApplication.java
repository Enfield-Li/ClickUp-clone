package com.example.team;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableEurekaClient
@EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(scanBasePackages = {
        "com.example.team",
        "com.example.amqp",
        "com.example.clients",
        "com.example.serviceSecurityConfig",
        "com.example.serviceExceptionHandling",
//        "com.example.serviceConfig",
})
public class TeamApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamApplication.class, args);
    }
}
