package com.example.team.controller;

import static com.example.clients.UrlConstants.LIST_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateListDTO;
import com.example.team.model.ListCategory;
import com.example.team.service.ListCategoryService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "ListCategory")
@RequestMapping(LIST_API_VERSION)
class ListCategoryController {

    private final ListCategoryService service;

    @PostMapping
    public ResponseEntity<ListCategory> createSpace(
            @RequestBody CreateListDTO createListDTO) {
        var list = service.createList(createListDTO);
        return ResponseEntity.ok(list);
    }

}
