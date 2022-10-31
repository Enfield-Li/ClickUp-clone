package com.example.task.dto;

import javax.validation.constraints.NotNull;

public record UpdateTaskDescDTO(
    @NotNull Integer id,
    @NotNull String newDesc
) {}

