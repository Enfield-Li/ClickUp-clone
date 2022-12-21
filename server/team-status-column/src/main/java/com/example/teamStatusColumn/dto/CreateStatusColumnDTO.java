package com.example.teamStatusColumn.dto;

public record CreateStatusColumnDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
