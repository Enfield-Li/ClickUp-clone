package com.example.team.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public record CreateSpaceDTO(
        String color,
        String avatar,
        Boolean isPrivate,
        @NotNull Integer teamId,
        @Size(min = 1) String name,
        @NotNull Integer orderIndex,
        @NotNull Integer defaultStatusCategoryId) {
}
