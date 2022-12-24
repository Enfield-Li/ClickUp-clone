package com.example.userTeam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// import org.springframework.cloud.openfeign.EnableFeignClients;

// @EnableEurekaClient
// @EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(scanBasePackages = {
        // "com.example.amqp",
        "service-config",
        "com.example.clients",
        "com.example.user-team",
        // "com.example.serviceSecurityConfig",
})
public class UserTeamApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserTeamApplication.class, args);
    }
}
