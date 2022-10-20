package com.example.clients.taskEvent.updateEventDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotNull;

public record UpdateEventDTO(
    Integer id,
    Field field,
    @NotNull Integer taskId,
    @NotNull Integer userId,
    @NotNull String username,

    @NotNull String after,
    String before
) {}
