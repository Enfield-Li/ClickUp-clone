package com.example.team.dto;

import javax.validation.constraints.NotNull;

public record CreateSpaceDTO(
        String color,
        Boolean isPrivate,
        @NotNull String name,
        @NotNull Integer teamId,
        @NotNull Integer orderIndex) {
}
