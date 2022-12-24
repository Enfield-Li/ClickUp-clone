package com.example.clients.team;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

public record CategoryDTO(
        Integer id,
        @NotNull String name,
        Date createdAt,
        String color,
        Boolean isPrivate,
        List<CategoryDTO> allLists,
        Integer taskAmount,
        Integer parentFolderId,
        Integer statusColumnsCategoryId) {
}
