package com.example.task.dto;

import javax.validation.constraints.NotNull;

public record UpdateTaskDescDTO(
    @NotNull Integer taskId,
    @NotNull String newDesc
) {}
