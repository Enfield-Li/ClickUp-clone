package com.example.team.dto;

import javax.validation.constraints.Size;

public record CreateTeamDTO(
        String color,
        String avatar,
        @Size(min = 1) String name) {
}
