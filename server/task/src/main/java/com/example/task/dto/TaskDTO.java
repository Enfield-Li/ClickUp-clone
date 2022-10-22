package com.example.task.dto;

import java.util.Date;
import java.util.Set;

import javax.validation.constraints.NotNull;

import com.example.task.model.Participant;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.PreviousTask;
import com.example.task.model.PreviousTaskBeforeFinish;

public record TaskDTO(
   @NotNull Integer id,
   @NotNull String title,
   @NotNull Integer creatorId,
   @NotNull String creatorName,
   
   Date dueDate,
   Integer status,
   Integer priority,
   String description,
   Set<Participant> watchers,
   Set<Participant> assignees,
   PreviousTask previousTask,
   Set<UpdateEventDTO> taskEvents,
   PreviousTaskBeforeFinish previousTaskBeforeFinish
) {}
