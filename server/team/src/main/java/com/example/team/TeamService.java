package com.example.team;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.team.model.Team;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public Boolean createTeam(Team team) {
        teamRepository.save(team);
        return true;
    }
}
