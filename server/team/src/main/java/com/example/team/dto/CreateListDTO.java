package com.example.team.dto;

import javax.validation.constraints.NotNull;

public record CreateListDTO(
        Integer folderId,
        Integer orderIndex,
        @NotNull String name,
        @NotNull Integer spaceId,
        @NotNull Integer statusColumnsCategoryId) {
}
