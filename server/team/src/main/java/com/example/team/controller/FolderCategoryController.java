package com.example.team.controller;

import static com.example.clients.UrlConstants.Folder_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.service.FolderCategoryService;
import com.example.team.service.FolderCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(Folder_API_VERSION)
class FolderCategoryController {

    private final FolderCategoryService service;

    @PostMapping
    public ResponseEntity<Space> createSpace(
            @RequestBody CreateSpaceDTO createSpaceDTO) {
        return null;
    }

}
