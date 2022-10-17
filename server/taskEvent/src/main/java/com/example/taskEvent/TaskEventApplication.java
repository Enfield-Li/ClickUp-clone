package com.example.taskEvent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

// @EnableEurekaClient
@SpringBootApplication(
    scanBasePackages = { "com.example.amqp", "com.example.taskEvent" }
)
public class TaskEventApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskEventApplication.class, args);
    }
}
