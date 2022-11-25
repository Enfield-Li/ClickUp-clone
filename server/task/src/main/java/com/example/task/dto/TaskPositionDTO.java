package com.example.task.dto;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;

public record TaskPositionDTO(
    @NotNull Integer taskId,

    Date expectedDueDate,
    StatusPosition status,
    DueDatePosition dueDate,
    PriorityPosition priority,

    List<UpdateEventDTO> taskEvents // Messaging event dto
) {}
