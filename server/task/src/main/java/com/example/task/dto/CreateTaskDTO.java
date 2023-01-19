package com.example.task.dto;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

public record CreateTaskDTO(
        String description,
        LocalDateTime expectedDueDate,

        @NotNull String title,
        @NotNull Integer listId,
        @NotNull StatusPosition status,
        @NotNull PriorityPosition priority) {
}
