package com.example.team.controller;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.service.SpaceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.example.clients.UrlConstants.SPACE_API_VERSION;

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

    @PutMapping("{spaceId}")
    public ResponseEntity<Boolean> updateSpace(
            @PathVariable Integer spaceId,
            @RequestParam Map<String, String> params) {
        var updated = service.updateSpace(spaceId, params);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{spaceId}")
    public ResponseEntity<Boolean> deleteSpace(
            @PathVariable("spaceId") Integer spaceId) {
        var deleted = service.deleteSpace(spaceId);
        return ResponseEntity.ok(deleted);
    }


}
