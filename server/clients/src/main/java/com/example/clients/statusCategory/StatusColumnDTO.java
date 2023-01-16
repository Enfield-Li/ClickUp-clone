package com.example.clients.statusCategory;

public record StatusColumnDTO(
        Integer id,
        String title,
        String color,
        Integer orderIndex,
        Boolean markAsClosed,
        Boolean isDefaultStatus) {
}
