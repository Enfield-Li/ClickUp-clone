package com.example.devTest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.example.devTest",
        "com.example.clients",
        "service-config",
})
public class DevTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevTestApplication.class, args);
    }
}
