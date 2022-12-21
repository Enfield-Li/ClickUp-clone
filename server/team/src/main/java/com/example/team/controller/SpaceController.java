package com.example.team.controller;

import static com.example.clients.UrlConstants.SPACE_API_VERSION;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.service.SpaceService;

@RestController
@RequestMapping(SPACE_API_VERSION)
class SpaceController {

    @Autowired
    SpaceService spaceService;

    @PostMapping
    public ResponseEntity<String> getAll(
            @RequestBody CreateSpaceDTO createSpaceDTO) {
        return ResponseEntity.ok("");
    }

}
