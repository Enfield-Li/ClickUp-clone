package com.example.teamStatusCategory.dto;

/**
 * CreateStatusColumnForCategoryDTO
 */
public record CreateStatusColumnForCategoryDTO(
        String title,
        String color,
        Integer categoryId,
        Integer orderIndex) {
}
