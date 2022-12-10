package com.example.team.dto;

public record CreateSpaceDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
