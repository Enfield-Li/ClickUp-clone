package com.example.team.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.clients.panelActivity.PanelActivityClient;
import com.example.clients.panelActivity.UpdateDefaultTeamIdDTO;
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

    private final UserInfo userInfo = UserInfo.builder()
            .userId(1).username("mockUser").build();

    public void test() {
        Team.builder()
                .name("team2")
                .color("rgb(255, 87, 34)")
                .build();
    }

    public TeamAndPanelActivityDTO getAllTeams(Integer userId) {
        var panelActivityDTO = panelActivityClient.getPanelActivity(userInfo.getUserId());
        var teams = teamRepository.findByMembersUserId(userId);
        return new TeamAndPanelActivityDTO(teams, panelActivityDTO);
    }

    public Boolean createTeam(CreateTeamDTO createTeamDTO) {
        var team = Team.convertFromCreateTeamDTO(createTeamDTO, userInfo);
        var space = Space.builder().team(team)
                .name("space").orderIndex(1).isPrivate(false).build();
        team.setSpaces(Set.of(space));

        teamRepository.saveAndFlush(team);

        // update panel activity
        var dto = new UpdateDefaultTeamIdDTO(userInfo.getUserId(), team.getId());
        var response = panelActivityClient.updateDefaultTeamId(dto);
        return response;
    }

    // public Boolean initTeam(UserInfo userInfo) {
    //     var initSpace = Space.builder().name("Space").build();
    //     var initTeam = Team.builder().owner(userInfo).build();
    //     // teamRepository.save(createTeamDTO);
    //     return true;
    // }
}
