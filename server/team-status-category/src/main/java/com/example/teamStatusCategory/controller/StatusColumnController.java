package com.example.teamStatusCategory.controller;

import static com.example.clients.UrlConstants.STATUS_COLUMN_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teamStatusCategory.dto.CreateStatusColumnForCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnDTO;
import com.example.teamStatusCategory.service.StatusColumnService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(STATUS_COLUMN_API_VERSION)
class StatusColumnController {

    private final StatusColumnService service;

    @PostMapping
    ResponseEntity<Integer> createStatusColumnForCategory(
            @RequestBody CreateStatusColumnForCategoryDTO dto) {
        var id = service.createStatusColumnForCategory(dto);
        return ResponseEntity.ok(id);
    }

    @PutMapping
    ResponseEntity<Boolean> updateStatusColumn(
            @RequestBody UpdateStatusColumnDTO dto) {
        var updated = service.updateStatusColumn(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{id}")
    ResponseEntity<Boolean> deleteStatusColumn(
            @PathVariable("id") Integer id) {
        var deleted = service.deleteStatusColumn(id);
        return ResponseEntity.ok(deleted);
    }
}
