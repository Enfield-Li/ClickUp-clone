package com.example.clients.task;

import com.example.clients.statusCategory.StatusCategoryDTO;

public record InitTasksInRegistrationDTO(
        Integer listCategoryId,
        StatusCategoryDTO statusCategoryDTO,
        Integer userId,
        String username
) {
}
