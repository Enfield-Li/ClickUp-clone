package com.example.statusColumn.dto;

public record CreateSpaceDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
