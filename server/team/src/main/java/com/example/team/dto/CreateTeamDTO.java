package com.example.team.dto;

import com.example.team.model.UserInfo;

public record CreateTeamDTO(
        String name,
        String color,
        Boolean isPrivate,
        UserInfo owner) {
}
