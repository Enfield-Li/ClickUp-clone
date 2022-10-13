package com.example.task.dto.unused;

import com.example.task.model.Participant;
import com.example.task.model.PreviousTask;
import java.util.Set;
import javax.validation.constraints.NotNull;

// unused
public record CreateTaskDTO(
    @NotNull String title,
    @NotNull Integer status,
    @NotNull Integer dueDate,
    @NotNull Integer priority,
    @NotNull Integer creatorId,
    @NotNull String creatorName,
    String description,

    Set<Participant> watchers,
    Set<Participant> assignees,
    
    Integer previous_item_id,
    PreviousTask previousItem
) {}
