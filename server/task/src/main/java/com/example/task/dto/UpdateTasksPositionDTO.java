package com.example.task.dto;

import com.example.task.model.Task;
import java.util.List;
import lombok.NonNull;

public record UpdateTasksPositionDTO(
    @NonNull Integer sourceTaskId,
    List<UpdateTaskDTO> taskDtoList
) {}
