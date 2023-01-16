package com.example.task.dto;

import java.util.List;

import com.example.task.model.Task;

public record GetTaskListDTO(
        Integer listId,
        Integer defaultStatusCategoryId) {
}
