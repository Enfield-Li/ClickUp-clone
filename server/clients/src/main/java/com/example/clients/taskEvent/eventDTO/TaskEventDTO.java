package com.example.clients.taskEvent.eventDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotNull;

public record TaskEventDTO(
  Integer id,
  Integer updateTo,
  Integer updateFrom,
  String commentContent,
  LocalDateTime createdAt,
  LocalDateTime updatedAt,
  TaskEventUpdateType updateAction,

  @NotNull Integer taskId,
  @NotNull Integer initiatorId,
  @NotNull String initiatorName,
  @NotNull TaskEventType eventType,
  @NotNull List<ParticipantDTO> participants,

  TaskEventDTO parentComment,
  Set<TaskEventDTO> childrenComments
) {}
