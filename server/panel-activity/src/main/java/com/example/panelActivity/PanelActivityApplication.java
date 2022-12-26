package com.example.panelActivity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// import org.springframework.cloud.openfeign.EnableFeignClients;

// @EnableEurekaClient
// @EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(scanBasePackages = {
        // "com.example.amqp",
        "com.example.clients",
        "com.example.serviceConfig",
        "com.example.panelActivity",
        "com.example.serviceExceptionHandling",
        // "com.example.serviceSecurityConfig",
})
public class PanelActivityApplication {

    public static void main(String[] args) {
        SpringApplication.run(PanelActivityApplication.class, args);
    }
}
