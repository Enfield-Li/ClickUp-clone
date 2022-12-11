package com.example.panelActivity.dto;

public record CreatePanelActivityDTO(
        String name,
        String color,
        Boolean isPrivate,
        Integer orderIndex) {
}
