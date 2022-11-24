package com.example.task.dto.unused;

import com.example.task.model.taskPosition.TaskDueDatePosition;
import com.example.task.model.taskPosition.TaskPriorityPosition;
import com.example.task.model.taskPosition.TaskStatusPosition;
import java.util.Date;
import javax.validation.constraints.NotNull;

public record CreateTaskDTO(
    String description,
    Date expectedDueDate,

    @NotNull String title,
    @NotNull TaskStatusPosition status,
    @NotNull TaskDueDatePosition dueDate,
    @NotNull TaskPriorityPosition priority
) {}
