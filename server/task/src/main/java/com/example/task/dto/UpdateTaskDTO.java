package com.example.task.dto;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.Participant;
import com.example.task.model.taskPosition.TaskDueDatePosition;
import com.example.task.model.taskPosition.TaskPriorityPosition;
import com.example.task.model.taskPosition.TaskStatusPosition;
import java.util.Date;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public record UpdateTaskDTO(
    @NotNull Integer id,
    @NotNull String title,
    @NotNull Participant creator,

    @NotNull TaskStatusPosition status,
    @NotNull TaskDueDatePosition dueDate,
    @NotNull TaskPriorityPosition priority,
    @NotEmpty Set<Participant> watchers,

    String description,
    Date expectedDueDate,
    Set<Participant> assignees,

    List<UpdateEventDTO> taskEvents // Messaging event dto
) {}
