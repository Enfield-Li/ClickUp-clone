package com.example.teamStatusCategory.dto;

import javax.validation.constraints.NotNull;

public record UpdateStatusColumnTitleDTO(
        @NotNull Integer id,
        @NotNull String title) {
}
