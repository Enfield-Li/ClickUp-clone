package com.example.task.dto.unused;

import com.example.task.model.PreviousTaskIds;
import java.util.Date;
import javax.validation.constraints.NotNull;

public record CreateTaskDTO(
    @NotNull String title,
    @NotNull Integer status,
    @NotNull Integer priority,

    String description,
    Date expectedDueDate,
    PreviousTaskIds previousTaskIds
) {}
