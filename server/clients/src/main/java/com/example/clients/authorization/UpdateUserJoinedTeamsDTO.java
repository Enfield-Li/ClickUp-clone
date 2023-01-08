package com.example.clients.authorization;

public record UpdateUserJoinedTeamsDTO(
        Integer userId,
        Integer teamId,
        Boolean isJoinTeam) {
}
