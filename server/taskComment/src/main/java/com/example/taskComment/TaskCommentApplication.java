package com.example.taskComment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
// import org.springframework.cloud.openfeign.EnableFeignClients;

// @EnableEurekaClient
// @EnableFeignClients(basePackages = "com.example.clients")
@SpringBootApplication(
    scanBasePackages = { "com.example.amqp", "com.example.taskComment" }
)
public class TaskCommentApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskCommentApplication.class, args);
    }
}
