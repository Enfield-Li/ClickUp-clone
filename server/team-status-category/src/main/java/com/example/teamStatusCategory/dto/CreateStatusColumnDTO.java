package com.example.teamStatusCategory.dto;

public record CreateStatusColumnDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
