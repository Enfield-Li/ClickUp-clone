package com.example.taskEvent.dto;

import java.time.LocalDateTime;
import java.util.Set;

import javax.validation.constraints.NotNull;

import com.example.clients.taskEvent.updateEventDTO.Field;
import com.example.taskEvent.model.Reaction;

public record CommentEventDTO(
    Integer id,
    Field field,
    @NotNull Integer taskId,
    @NotNull Integer userId,
    @NotNull String username,

    @NotNull String content,
    Set<Reaction> reactions
) {}
