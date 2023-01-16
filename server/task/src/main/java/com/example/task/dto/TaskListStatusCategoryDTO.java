package com.example.task.dto;

import java.util.List;

import com.example.clients.statusCategory.StatusCategoryDTO;
import com.example.task.model.Task;

public record TaskListStatusCategoryDTO(
        StatusCategoryDTO statusCategoryDTO,
        List<Task> taskList) {
}
