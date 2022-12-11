package com.example.panelActivity;

import static com.example.clients.UrlConstants.STATUS_COLUMN_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.panelActivity.model.PanelActivity;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(STATUS_COLUMN_API_VERSION)
class PanelActivityController {

    private final PanelActivityService statusColumnService;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @PostMapping
    ResponseEntity<Boolean> createStatusColumn(
            @RequestBody PanelActivity statusColumn) {
        var created = statusColumnService.createStatusColumn(statusColumn);
        return ResponseEntity.ok(created);
    }
}
