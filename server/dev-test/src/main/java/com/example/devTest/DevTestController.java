package com.example.devTest;

import static com.example.clients.UrlConstants.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TEAM_API_VERSION)
class DevTestController {

    private final DevTestService devTestService;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @PostMapping
    ResponseEntity<Boolean> test(
            @RequestBody Image statusColumn) {
        var created = devTestService.test(statusColumn);
        return ResponseEntity.ok(created);
    }
}
