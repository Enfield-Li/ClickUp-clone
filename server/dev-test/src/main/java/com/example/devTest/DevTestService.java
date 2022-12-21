package com.example.devTest;

import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DevTestService {

    private final DevTestRepository devTestRepository;

    public Image test(MultipartFile file) throws IOException {
        var image = Image.builder().image(file.getBytes()).build();
        return devTestRepository.save(image);
    }

    public Image get() {
        return devTestRepository.findById(1).orElseThrow();
    }

}
