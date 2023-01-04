package com.example.team.dto;

import javax.validation.constraints.NotNull;

public record CreateTeamDTO(
        String color,
        String avatar,
        @NotNull String name) {
}
