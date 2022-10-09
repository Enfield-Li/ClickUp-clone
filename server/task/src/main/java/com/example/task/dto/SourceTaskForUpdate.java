package com.example.task.dto;

import java.util.Set;

import javax.validation.constraints.NotNull;

import com.example.task.model.Event;
import com.example.task.model.PreviousTask;

public record SourceTaskForUpdate(
   @NotNull Integer id,
   @NotNull String title,
   @NotNull Integer status,
   @NotNull Integer priority,
   @NotNull Integer dueDate,
   String description,
   @NotNull Integer creatorId,
   @NotNull String creatorName,
   PreviousTask previousItem,
   Set<Event> events
) {}
