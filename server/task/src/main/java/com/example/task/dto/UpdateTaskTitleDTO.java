package com.example.task.dto;

public record UpdateTaskTitleDTO(
    Integer taskId,
    String newTitle
) {}
