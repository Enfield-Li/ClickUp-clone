package com.example.task.dto.eventDTO;

import java.time.LocalDateTime;
import java.util.Set;
import javax.validation.constraints.NotNull;

public record EventDTO(
  Integer id,
  Integer updateTo,
  Integer updateFrom,
  String commentContent,
  LocalDateTime createdAt,
  LocalDateTime updatedAt,

  @NotNull Integer taskId,
  @NotNull Integer initiatorId,
  @NotNull String initiatorName,
  @NotNull EventType eventType,
  UpdateAction updateAction,

  EventDTO parentComment,
  Set<EventDTO> childrenComments
) {}
