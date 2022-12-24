package com.example.userTeam.dto;

public record CreatePanelActivityDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
