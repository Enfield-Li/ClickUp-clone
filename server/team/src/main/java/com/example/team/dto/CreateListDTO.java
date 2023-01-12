package com.example.team.dto;

import javax.validation.constraints.NotNull;

public record CreateListDTO(
        @NotNull String name,
        @NotNull Integer spaceId,
        @NotNull Integer folderId,
        @NotNull Integer statusColumnsCategoryId) {
}
