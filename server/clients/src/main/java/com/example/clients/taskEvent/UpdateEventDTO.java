package com.example.clients.taskEvent;

import javax.validation.constraints.NotNull;

import com.example.clients.taskEvent.assignmentEventDTO.AssignmentEventAction;
import com.example.clients.taskEvent.assignmentEventDTO.UserInfo;

public record UpdateEventDTO(
    @NotNull Field field,
    @NotNull Integer taskId,
    @NotNull Integer userId,
    @NotNull String username,

    String afterUpdate,
    String beforeUpdate
) {}
