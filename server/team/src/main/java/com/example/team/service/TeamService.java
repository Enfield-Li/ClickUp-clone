package com.example.team.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.team.dto.CreateTeamDTO;
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

    private final UserInfo userInfo = UserInfo.builder()
            .userId(1).username("mockUser").build();

    public void test() {
        // return teamRepository.findAll();
        System.out.println("start: ");
        System.out.println(teamRepository.findByMembersUserId(1));
        System.out.println(teamRepository.findByIdIn(List.of(1, 2)));
        System.out.println("end...");
    }

    public List<Team> getAllTeams(List<Integer> teamIds) {
        return teamRepository.findByIdIn(teamIds);
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
