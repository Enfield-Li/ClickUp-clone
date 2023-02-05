package com.example.devTest;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
