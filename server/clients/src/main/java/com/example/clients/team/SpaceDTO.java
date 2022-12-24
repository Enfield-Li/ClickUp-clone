package com.example.clients.team;

import java.util.List;

import javax.validation.constraints.NotNull;

public record SpaceDTO(
        Integer id,
        @NotNull String name,
        @NotNull Integer orderIndex,
        @NotNull Boolean isPrivate,
        String color,
        Integer defaultStatusColumnId,
        List<CategoryDTO> allListOrFolder) {
}
