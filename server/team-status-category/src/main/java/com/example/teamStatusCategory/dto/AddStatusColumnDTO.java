package com.example.teamStatusCategory.dto;

public record AddStatusColumnDTO(
        String title,
        String color,
        Integer listId,
        Integer statusCategoryId,
        Integer orderIndex
) {
}
