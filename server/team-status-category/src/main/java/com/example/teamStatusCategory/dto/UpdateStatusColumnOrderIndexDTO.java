package com.example.teamStatusCategory.dto;

import javax.validation.constraints.NotNull;

public record UpdateStatusColumnOrderIndexDTO(
        @NotNull Integer id,
        @NotNull Integer orderIndex) {
}
