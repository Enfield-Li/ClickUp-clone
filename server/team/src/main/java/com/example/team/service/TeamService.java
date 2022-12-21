package com.example.team.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.team.dto.CreateTeamDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
import com.example.team.repository.TeamRepository;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    UserInfo userInfo = UserInfo.builder().id(1)
            .userId(1).username("mockUser")
            .email("mockUser@google.com").build();

    public Boolean createTeam(CreateTeamDTO createTeamDTO) {
        // teamRepository.save(createTeamDTO);
        return true;
    }

    // public Boolean initTeam(UserInfo userInfo) {
    //     var initSpace = Space.builder().name("Space").build();
    //     var initTeam = Team.builder().owner(userInfo).build();
    //     // teamRepository.save(createTeamDTO);
    //     return true;
    // }
}
