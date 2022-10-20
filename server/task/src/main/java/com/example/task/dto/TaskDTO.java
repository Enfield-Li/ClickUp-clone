package com.example.task.dto;

import java.util.Set;

import javax.validation.constraints.NotNull;

import com.example.clients.taskEvent.updateEventDTO.UpdateEventDTO;
import com.example.task.model.Participant;
import com.example.task.model.PreviousTask;
import com.example.task.model.PreviousTaskBeforeFinish;

public record TaskDTO(
   @NotNull Integer id,
   @NotNull String title,
   @NotNull Integer status,
   @NotNull Integer priority,
   @NotNull Integer dueDate,
   @NotNull Integer creatorId,
   @NotNull String creatorName,
   @NotNull Set<Participant> watchers,

   String description,
   PreviousTask previousTask,
   Set<Participant> assignees,
   Set<UpdateEventDTO> updateEvents,
   PreviousTaskBeforeFinish previousTaskBeforeFinish
) {}
