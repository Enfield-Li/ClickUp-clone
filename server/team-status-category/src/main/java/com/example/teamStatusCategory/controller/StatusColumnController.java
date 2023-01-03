package com.example.teamStatusCategory.controller;

import static com.example.clients.UrlConstants.STATUS_COLUMN_API_VERSION;
import static com.example.teamStatusCategory.UrlConstants.COLOR;
import static com.example.teamStatusCategory.UrlConstants.ORDER_INDEX;
import static com.example.teamStatusCategory.UrlConstants.TITLE;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teamStatusCategory.dto.UpdateStatusColumnColorDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnOrderIndexDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnTitleDTO;
import com.example.teamStatusCategory.model.StatusColumn;
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
    ResponseEntity<Boolean> createStatusColumn(
            @RequestBody StatusColumn statusColumn) {
        var created = service.createStatusColumn(statusColumn);
        return ResponseEntity.ok(created);
    }

    @PutMapping(TITLE)
    ResponseEntity<Boolean> updateStatusColumnTitle(
            @RequestBody UpdateStatusColumnTitleDTO dto) {
        var updated = service.updateStatusColumnTitle(dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping(COLOR)
    ResponseEntity<Boolean> updateStatusColumnColor(
            @RequestBody UpdateStatusColumnColorDTO dto) {
        var updated = service.updateStatusColumnColor(dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping(ORDER_INDEX)
    ResponseEntity<Boolean> updateStatusColumnOrderIndex(
            @RequestBody UpdateStatusColumnOrderIndexDTO dto) {
        var updated = service.updateStatusColumnOrderIndex(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{id}")
    ResponseEntity<Boolean> deleteStatusColumn(
            @PathVariable("id") Integer id) {
        var deleted = service.deleteStatusColumn(id);
        return ResponseEntity.ok(deleted);
    }
}
