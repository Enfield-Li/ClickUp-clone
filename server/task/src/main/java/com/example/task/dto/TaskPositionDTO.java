package com.example.task.dto;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;

public record TaskPositionDTO(
        @NotNull Integer taskId,

        StatusPosition status,
        DueDatePosition dueDate,
        PriorityPosition priority,
        LocalDateTime expectedDueDate,

        UpdateEventDTO taskEvents // Messaging event dto
) {
}
