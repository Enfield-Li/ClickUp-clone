package com.example.team.controller;

import com.example.team.dto.CreateListDTO;
import com.example.team.model.ListCategory;
import com.example.team.service.ListCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.example.clients.UrlConstants.LIST_API_VERSION;

@RestController
@RequiredArgsConstructor
@Tag(name = "List")
@RequestMapping(LIST_API_VERSION)
class ListCategoryController {

    private final ListCategoryService service;

    @PostMapping
    public ResponseEntity<ListCategory> createList(
            @RequestBody CreateListDTO createListDTO) {
        var list = service.createList(createListDTO);
        return ResponseEntity.ok(list);
    }

    @PutMapping("{listId}")
    public ResponseEntity<Boolean> updateList(
            @PathVariable Integer listId,
            @RequestParam Map<String, String> params) {
        var updated = service.updateList(listId, params);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<Boolean> deleteListCategory(
            @PathVariable("listId") Integer listId) {
        var deleted = service.deleteListCategory(listId);
        return ResponseEntity.ok(deleted);
    }
}
