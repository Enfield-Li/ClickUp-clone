package com.example.team.controller;

import static com.example.clients.UrlConstants.Folder_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateFolderDTO;
import com.example.team.model.FolderCategory;
import com.example.team.service.FolderCategoryService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@Tag(name = "Space")
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
}
