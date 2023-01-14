package com.example.team.controller;

import static com.example.clients.UrlConstants.List_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.service.ListCategoryService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "ListCategory")
@RequestMapping(List_API_VERSION)
class ListCategoryController {

    private final ListCategoryService service;

    @PostMapping
    public ResponseEntity<Space> createSpace(
            @RequestBody CreateSpaceDTO createSpaceDTO) {

        return null;
    }

}
