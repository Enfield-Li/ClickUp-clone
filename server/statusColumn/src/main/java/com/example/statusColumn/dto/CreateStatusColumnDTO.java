package com.example.statusColumn.dto;

public record CreateStatusColumnDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
