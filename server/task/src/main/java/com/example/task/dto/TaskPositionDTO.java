package com.example.task.dto;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

public record TaskPositionDTO(
        @NotNull Integer taskId,
        StatusPosition status,
        PriorityPosition priority,
        LocalDateTime expectedDueDate,

        UpdateEventDTO taskEvents // Messaging event dto
) {
}
