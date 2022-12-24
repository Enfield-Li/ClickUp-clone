package com.example.team.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.clients.panelActivity.PanelActivityClient;
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
        // return teamRepository.findAll();
        System.out.println("start: ");
        System.out.println(teamRepository.findByMembersUserId(1));
        System.out.println(teamRepository.findByIdIn(List.of(1, 2)));
        System.out.println("end...");
    }

    public TeamAndPanelActivityDTO getAllTeams(List<Integer> teamIds) {
        var panelActivityDTO = panelActivityClient.getPanelActivity(userInfo.getUserId());
        var teams = teamRepository.findByIdIn(teamIds);
        return new TeamAndPanelActivityDTO(teams, panelActivityDTO);
    }

    public Boolean createTeam(CreateTeamDTO createTeamDTO) {
        var team = Team.convertFromCreateTeamDTO(createTeamDTO, userInfo);
        var space = Space.builder().team(team)
                .name("space").orderIndex(1).isPrivate(false).build();
        team.setSpaces(Set.of(space));

        teamRepository.save(team);

        // update userTeam service
        return true;
    }

    // public Boolean initTeam(UserInfo userInfo) {
    //     var initSpace = Space.builder().name("Space").build();
    //     var initTeam = Team.builder().owner(userInfo).build();
    //     // teamRepository.save(createTeamDTO);
    //     return true;
    // }
}
