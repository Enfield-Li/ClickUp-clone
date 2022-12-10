package com.example.team;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    UserInfo userInfo = UserInfo.builder().id(1)
            .userId(1).username("mockUser").build();

    public Boolean createTeam(Team team) {
        teamRepository.save(team);
        return true;
    }
}
