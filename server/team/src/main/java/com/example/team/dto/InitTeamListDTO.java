package com.example.team.dto;

import java.util.Set;

import com.example.clients.teamActivity.TeamActivityDTO;
import com.example.team.model.Team;

public record InitTeamListDTO(
        Set<Team> teams,
        TeamActivityDTO teamActivity) {
}
