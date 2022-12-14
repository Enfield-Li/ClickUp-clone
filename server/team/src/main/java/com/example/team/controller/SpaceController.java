package com.example.team.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.service.SpaceService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/space")
class SpaceController {

    @Autowired
    SpaceService spaceService;

    @PostMapping
    public ResponseEntity<String> getAll(@RequestBody CreateSpaceDTO createSpaceDTO) {
        return ResponseEntity.ok("");
    }

}
