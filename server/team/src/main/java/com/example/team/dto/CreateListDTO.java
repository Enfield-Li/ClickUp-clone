package com.example.team.dto;

import javax.validation.constraints.NotNull;

public record CreateListDTO(
        Integer orderIndex,
        @NotNull String name,
        @NotNull Integer spaceId,
        @NotNull Integer folderId,
        @NotNull Integer statusColumnsCategoryId) {
}
