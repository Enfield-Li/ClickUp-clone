package com.example.team.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

public record CreateFolderDTO(
        Boolean isPrivate,
        @NotNull String name,
        @NotNull Integer orderIndex,
        @NotNull Integer statusCategoryId,
        List<String> allListNames) {
}
