package com.example.clients.authorization;

public record UpdateUserJoinedTeamsDTO(
        Integer userId,
        Boolean isJoinTeam) {
}
