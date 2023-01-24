package com.example.teamStatusCategory.dto;

import javax.validation.constraints.NotNull;

public record UpdateStatusColumnDTO(
        @NotNull Integer id,
        String title,
        String color,
        Integer orderIndex) {
}
