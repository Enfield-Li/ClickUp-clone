package com.example.team.controller;

import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.team.dto.CreateFolderDTO;
import com.example.team.model.FolderCategory;
import com.example.team.service.FolderCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.clients.UrlConstants.Folder_API_VERSION;

@RestController
@Tag(name = "Folder")
@RequiredArgsConstructor
@RequestMapping(Folder_API_VERSION)
class FolderCategoryController {

    private final FolderCategoryService service;

    @PostMapping
    public ResponseEntity<FolderCategory> createFolder(
            @RequestBody CreateFolderDTO createSpaceDTO) {
        var folderCategory = service.createFolder(createSpaceDTO);
        return ResponseEntity.ok(folderCategory);
    }

    @DeleteMapping("/{folderCategoryId}")
    ResponseEntity<Boolean> deleteFolderCategory(
            @PathVariable("folderCategoryId") Integer folderCategoryId,
            @RequestBody UpdateTeamActivityDTO dto) {
        var deleted = service.deleteFolderCategory(folderCategoryId, dto);
        return ResponseEntity.ok(deleted);
    }
}
