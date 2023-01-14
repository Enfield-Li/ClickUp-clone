package com.example.team.controller;

import static com.example.clients.UrlConstants.SPACE_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.service.SpaceService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@Tag(name = "Space")
@RequiredArgsConstructor
@RequestMapping(SPACE_API_VERSION)
class SpaceController {

    private final SpaceService service;

    @PostMapping
    public ResponseEntity<Space> createSpace(
            @RequestBody CreateSpaceDTO createSpaceDTO) {
        var space = service.createSpace(createSpaceDTO);

        return ResponseEntity.ok(space);
    }

}
