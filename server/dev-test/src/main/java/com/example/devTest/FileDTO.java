package com.example.devTest;

import org.springframework.web.multipart.MultipartFile;

public record FileDTO(
        Integer id,
        MultipartFile file) {
}
