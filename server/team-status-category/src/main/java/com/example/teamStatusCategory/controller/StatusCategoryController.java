package com.example.teamStatusCategory.controller;

import static com.example.clients.UrlConstants.STATUS_CATEGORY_API_VERSION;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.service.StatusCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(STATUS_CATEGORY_API_VERSION)
class StatusCategoryController {

    private final StatusCategoryService statusCategoryService;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @GetMapping("/{teamId}")
    ResponseEntity<List<StatusCategory>> getStatusCategoryForTeam(
            @PathVariable("teamId") Integer teamId) {
        var allTeamStatusCategory = statusCategoryService
                .getStatusCategoryForTeam(teamId);
        return ResponseEntity.ok(allTeamStatusCategory);
    }

    @PostMapping
    ResponseEntity<StatusCategory> createStatusCategory(
            @RequestBody CreateStatusCategoryDTO CreateStatusCategoryDTO) {
        var statusCategory = statusCategoryService
                .createStatusCategory(CreateStatusCategoryDTO);
        return ResponseEntity.ok(statusCategory);
    }
}
