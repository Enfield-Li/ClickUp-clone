package com.example.team.dto;

import java.util.List;

import com.example.clients.panelActivity.PanelActivityDTO;
import com.example.team.model.Team;

public record TeamAndPanelActivityDTO(
        List<Team> teams,
        PanelActivityDTO panelActivity) {
}
