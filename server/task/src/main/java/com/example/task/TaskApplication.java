package com.example.task;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
  scanBasePackages = { "com.example.task", "com.example.clients", "com.example.amqp" }
)
public class TaskApplication {

  public static void main(String[] args) {
    SpringApplication.run(TaskApplication.class, args);
  }
}
