package com.example.task.dto.unused;

import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

import java.time.LocalDateTime;
import java.util.Date;
import javax.validation.constraints.NotNull;

public record CreateTaskDTO(
        String description,
        LocalDateTime expectedDueDate,

        @NotNull String title,
        @NotNull Integer listId,
        @NotNull StatusPosition status,
        @NotNull DueDatePosition dueDate,
        @NotNull PriorityPosition priority) {
}
