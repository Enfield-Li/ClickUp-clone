package com.example.task.dto;

import java.util.Set;

import javax.validation.constraints.NotNull;

import com.example.task.dto.eventDTO.EventDTO;
import com.example.task.model.PreviousTask;
import com.example.task.model.PreviousTaskBeforeFinish;

public record TaskDTO(
   @NotNull Integer id,
   @NotNull String title,
   @NotNull Integer status,
   @NotNull Integer priority,
   @NotNull Integer dueDate,
   String description,
   @NotNull Integer creatorId,
   @NotNull String creatorName,
   PreviousTask previousTask,
   PreviousTaskBeforeFinish previousTaskBeforeFinish,
   Set<EventDTO> events
) {}
