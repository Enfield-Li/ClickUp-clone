package com.example.clients.panelActivity;

import java.util.List;

import javax.validation.constraints.NotNull;

public record PanelActivityDTO(
        Integer id,
        @NotNull Integer userId,
        @NotNull Integer defaultTeamId,
        List<TeamActivityDTO> teamActivities) {
}
