package com.example.team.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public record CreateListDTO(
        Integer folderId,
        @NotNull Integer spaceId,
        @Size(min = 1) String name,
        @NotNull Integer orderIndex,
        @NotNull Integer defaultStatusCategoryId) {
}
