package com.example.space.dto;

public record CreateSpaceDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
