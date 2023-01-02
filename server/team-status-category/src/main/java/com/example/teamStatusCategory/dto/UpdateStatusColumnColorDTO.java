package com.example.teamStatusCategory.dto;

import javax.validation.constraints.NotNull;

public record UpdateStatusColumnColorDTO(
        @NotNull Integer id,
        @NotNull String color) {
}
