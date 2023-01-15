package com.example.team.dto;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public record CreateFolderDTO(
        Boolean isPrivate,
        @NotNull Integer spaceId,
        @Size(min = 1) String name,
        @NotNull Integer orderIndex,
        @NotNull Integer statusColumnsCategoryId,
        List<String> allListNames) {
}
