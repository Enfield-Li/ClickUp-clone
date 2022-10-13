package com.example.clients.taskEvent.eventDTO;

import java.time.LocalDateTime;
import java.util.Set;
import javax.validation.constraints.NotNull;

public record TaskEventDTO(
  Integer id,
  Integer updateTo,
  Integer updateFrom,
  String commentContent,
  LocalDateTime createdAt,
  LocalDateTime updatedAt,

  @NotNull Integer taskId,
  @NotNull Integer initiatorId,
  @NotNull String initiatorName,
  @NotNull TaskEventType eventType,
  TaskEventUpdateType updateAction,

  TaskEventDTO parentComment,
  Set<TaskEventDTO> childrenComments
) {}
