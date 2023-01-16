package com.example.clients.statusCategory;

import java.util.Set;

public record StatusCategoryDTO(
        Integer id,
        String name,
        Integer teamId,
        Set<StatusColumnDTO> statusColumns) {
}
