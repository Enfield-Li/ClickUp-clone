package com.example.devTest;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
class DevTestController {

    private final DevTestService devTestService;

    @GetMapping(produces = MediaType.IMAGE_JPEG_VALUE)
    ResponseEntity<?> test() {
        var img = devTestService.get();
        return ResponseEntity.ok(img.getImage());

    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam MultipartFile file) throws IOException {
        var created = devTestService.test(file);
        return ResponseEntity.ok(created);
    }

    @PostMapping(value = "/2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> uploadImage2(@ModelAttribute FileDTO dto) throws IOException {
        var created = devTestService.test(dto.file());
        return ResponseEntity.ok(created.getImage());
    }

}
