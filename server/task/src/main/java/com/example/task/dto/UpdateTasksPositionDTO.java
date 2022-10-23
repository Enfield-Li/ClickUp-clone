package com.example.task.dto;

import java.util.List;

import com.example.task.model.Task;

import lombok.NonNull;

public record UpdateTasksPositionDTO(
  @NonNull Integer sourceTaskId,
  List<UpdateTaskDTO> taskDtoList
) {}
