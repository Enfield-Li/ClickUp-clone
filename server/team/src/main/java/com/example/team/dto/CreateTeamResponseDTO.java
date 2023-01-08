package com.example.team.dto;

import com.example.clients.teamActivity.TeamActivityDTO;
import com.example.team.model.Team;

public record CreateTeamResponseDTO(
        Team team,
        TeamActivityDTO teamActivityDTO) {
}
