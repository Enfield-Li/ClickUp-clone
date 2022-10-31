package com.example.task.dto;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.Participant;
import com.example.task.model.PreviousTaskIds;
import com.example.task.model.PreviousTaskIdsBeforeFinish;
import java.util.Date;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotNull;

public record UpdateTaskDTO(
    @NotNull Integer id,
    @NotNull String title,

    Integer status,
    Integer dueDate,
    Integer priority,
    String description,
    Date expectedDueDate,
    Set<Participant> watchers,
    Set<Participant> assignees,
    PreviousTaskIds previousTaskIds,
    List<UpdateEventDTO> taskEvents,
    PreviousTaskIdsBeforeFinish previousTaskIdsBeforeFinish
) {}
