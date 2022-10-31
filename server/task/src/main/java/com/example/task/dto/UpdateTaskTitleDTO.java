package com.example.task.dto;

import javax.validation.constraints.NotNull;

public record UpdateTaskTitleDTO(
    @NotNull Integer taskId,
    @NotNull String newTitle
) {}
