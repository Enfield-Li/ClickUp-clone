package com.example.team.dto;

import java.util.List;

import com.example.clients.teamActivity.TeamActivityDTO;
import com.example.team.model.Team;

public record TeamAndActivityDTO(
        List<Team> teams,
        TeamActivityDTO teamActivityDTO) {
}
