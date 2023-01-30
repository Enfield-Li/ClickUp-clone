package com.example.teamStatusCategory.controller;

import com.example.teamStatusCategory.dto.CreateStatusColumnDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnDTO;
import com.example.teamStatusCategory.service.StatusColumnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.clients.UrlConstants.STATUS_COLUMN_API_VERSION;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(STATUS_COLUMN_API_VERSION)
class StatusColumnController {

    private final StatusColumnService service;

    @PostMapping
    ResponseEntity<Integer> createStatusColumn(
            @RequestBody CreateStatusColumnDTO dto) {
        var id = service.createStatusColumn(dto);
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
