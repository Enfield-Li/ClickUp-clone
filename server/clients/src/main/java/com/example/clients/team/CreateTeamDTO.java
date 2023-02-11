package com.example.clients.team;

import javax.validation.constraints.Size;

public record CreateTeamDTO(
        String color,
        String avatar,
        @Size(min = 1) String name) {
}
