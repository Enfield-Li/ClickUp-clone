package com.example.teamStatusCategory.dto;

import java.util.Set;

import com.example.teamStatusCategory.model.StatusColumn;

public record CreateStatusCategoryDTO(
        String name,
        Integer teamId,
        Set<StatusColumn> statusColumns) {
}
