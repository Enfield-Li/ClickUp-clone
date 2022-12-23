package com.example.team.service;

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

    UserInfo userInfo = UserInfo.builder()
            .userId(1).username("mockUser")
            .email("mockUser@google.com").build();

    public Boolean createTeam(CreateTeamDTO createTeamDTO) {
        var team = Team.convertFromCreateTeamDTO(createTeamDTO, userInfo);
        var space = Space.builder().team(team).name("space").orderIndex(1).isPrivate(false).build();
        team.setSpaces(Set.of(space));

        teamRepository.save(team);
        return true;
    }

    // public Boolean initTeam(UserInfo userInfo) {
    //     var initSpace = Space.builder().name("Space").build();
    //     var initTeam = Team.builder().owner(userInfo).build();
    //     // teamRepository.save(createTeamDTO);
    //     return true;
    // }
}
