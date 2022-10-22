package com.example.taskEvent.dto;

public record ReactionDTO(
    Integer id,
    Integer userId,
    String username,
    String reaction
) {}
