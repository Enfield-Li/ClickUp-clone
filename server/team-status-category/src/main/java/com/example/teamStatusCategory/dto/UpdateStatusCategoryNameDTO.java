package com.example.teamStatusCategory.dto;

import javax.validation.constraints.NotNull;

public record UpdateStatusCategoryNameDTO(
        @NotNull Integer id,
        @NotNull String name) {
}
