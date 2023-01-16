package com.example.teamStatusCategory.controller;

import static com.example.clients.UrlConstants.STATUS_CATEGORY_API_VERSION;
import static com.example.teamStatusCategory.UrlConstants.NAME;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusCategoryNameDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.service.StatusCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(STATUS_CATEGORY_API_VERSION)
class StatusCategoryController {

    private final StatusCategoryService service;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @GetMapping("/{id}")
    ResponseEntity<StatusCategory> getStatusCategoryForList(
            @PathVariable("id") Integer id) {
        var statusCategory = service.getStatusCategoryForList(id);
        return ResponseEntity.ok(statusCategory);
    }

    @GetMapping("/{teamId}")
    ResponseEntity<List<StatusCategory>> getStatusCategoryForTeam(
            @PathVariable("teamId") Integer teamId) {
        var allTeamStatusCategory = service.getStatusCategoryForTeam(teamId);
        return ResponseEntity.ok(allTeamStatusCategory);
    }

    @PostMapping("/{teamId}")
    ResponseEntity<Integer> initStatusCategoryForTeam(
            @PathVariable("teamId") Integer teamId) {
        var defaultId = service.initDefaultStatusCategory(teamId);
        return ResponseEntity.ok(defaultId);
    }

    @PostMapping
    ResponseEntity<StatusCategory> createStatusCategory(
            @RequestBody CreateStatusCategoryDTO CreateStatusCategoryDTO) {
        var statusCategory = service.createStatusCategory(
                CreateStatusCategoryDTO);
        return ResponseEntity.ok(statusCategory);
    }

    @PutMapping(NAME)
    ResponseEntity<Boolean> updateStatusCategoryName(
            @RequestBody UpdateStatusCategoryNameDTO dto) {
        var updated = service.updateStatusCategoryName(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{id}")
    ResponseEntity<Boolean> deleteStatusCategory(
            @PathVariable("id") Integer id) {
        var deleted = service.deleteStatusCategory(id);
        return ResponseEntity.ok(deleted);
    }

}
