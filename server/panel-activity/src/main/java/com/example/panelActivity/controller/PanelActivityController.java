package com.example.panelActivity.controller;

import static com.example.clients.UrlConstants.PANEL_ACTIVITY_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.clients.panelActivity.UpdateDefaultTeamIdDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.service.PanelActivityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(PANEL_ACTIVITY_API_VERSION)
class PanelActivityController {

    private final PanelActivityService panelActivityService;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @GetMapping("/{userId}")
    ResponseEntity<PanelActivity> getPanelActivity(
            @PathVariable("userId") Integer userId) {
        var panelActivity = panelActivityService.getPanelActivity(userId);
        return ResponseEntity.ok(panelActivity);
    }

    @PostMapping
    ResponseEntity<Boolean> updateDefaultTeamId(
            @RequestBody UpdateDefaultTeamIdDTO createPanelActivityDTO) {
        var created = panelActivityService.updatePanelActivity(createPanelActivityDTO);
        return ResponseEntity.ok(created);
    }

}
