package com.example.team.dto;

import com.example.team.model.UserInfo;

public record CreateTeamDTO(
        String name,
        Boolean isPrivate,
        UserInfo owner) {
}
