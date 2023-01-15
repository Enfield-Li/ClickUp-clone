package com.example.team.dto;

import javax.validation.constraints.NotNull;

public record CreateListDTO(
        Integer folderId,
        @NotNull String name,
        @NotNull Integer spaceId,
        @NotNull Integer orderIndex,
        @NotNull Integer statusColumnsCategoryId) {
}
