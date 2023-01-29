package com.example.teamStatusCategory.dto;

public record CreateStatusColumnDTO(
        String title,
        String color,
        Integer statusCategoryId,
        Integer orderIndex) {
}
