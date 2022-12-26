package com.example.team.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.clients.panelActivity.PanelActivityClient;
import com.example.clients.panelActivity.PanelActivityDTO;
import com.example.clients.panelActivity.UpdateDefaultTeamInCreationDTO;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.TeamAndPanelActivityDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
import com.example.team.repository.TeamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final SpaceService spaceService;
    private final TeamRepository teamRepository;
    private final PanelActivityClient panelActivityClient;

    public void test() {
        Team.builder().name("team2").color("rgb(255, 87, 34)").build();
    }

    public TeamAndPanelActivityDTO getAllTeams() {
        var userId = 1;

        var panelActivityDTO = panelActivityClient.getPanelActivity(userId);
        var teams = teamRepository.findByMembersUserId(userId);
        validateTeamsAndPanelActivity(panelActivityDTO, teams);
        return new TeamAndPanelActivityDTO(teams, panelActivityDTO);
    }

    public Boolean createTeam(CreateTeamDTO createTeamDTO) {
        UserInfo userInfo = UserInfo.builder()
                .userId(1).username("mockUser").build();

        var team = Team.convertFromCreateTeamDTO(createTeamDTO, userInfo);
        var space = Space.builder().team(team)
                .name("space").orderIndex(1).isPrivate(false).build();
        team.setSpaces(Set.of(space));

        teamRepository.saveAndFlush(team);

        // update panel activity
        var dto = new UpdateDefaultTeamInCreationDTO(team.getId(), space.getId());
        var response = panelActivityClient.updateDefaultTeamInCreation(dto);

        return response;
    }

    private void validateTeamsAndPanelActivity(
            PanelActivityDTO panelActivityDTO, List<Team> teams) {
        var ids = teams.stream().map(Team::getId).collect(Collectors.toList());
        var validateResult = panelActivityDTO.teamActivities().stream().allMatch(ta -> ids.contains(ta.teamId()));
        if (!validateResult) {
            throw new Error("Data integrity breached");
        }
    }

}
