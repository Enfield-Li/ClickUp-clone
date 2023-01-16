package com.example.clients.statusCategory;

import java.util.List;
import java.util.Set;

public record StatusCategoryDTO(
        Integer id,
        String name,
        Integer teamId,
        List<StatusColumnDTO> statusColumns) {
}
