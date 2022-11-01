package com.example.task.dto;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.Participant;
import com.example.task.model.PreviousTaskIds;
import com.example.task.model.PreviousTaskIdsBeforeFinish;
import java.util.Date;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public record UpdateTaskDTO(
    @NotNull Integer id,
    @NotNull String title,
    @NotNull Integer creatorId,
    @NotNull String creatorName,

    @NotNull Integer status,
    @NotNull Integer dueDate,
    @NotNull Integer priority,
    @NotEmpty Set<Participant> watchers,

    String description,
    Date expectedDueDate,
    Set<Participant> assignees,
    PreviousTaskIds previousTaskIds,
    PreviousTaskIdsBeforeFinish previousTaskIdsBeforeFinish,

    List<UpdateEventDTO> taskEvents // Messaging event dto
) {}
