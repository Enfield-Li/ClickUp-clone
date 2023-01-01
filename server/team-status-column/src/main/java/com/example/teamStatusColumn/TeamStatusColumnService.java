package com.example.teamStatusColumn;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.teamStatusColumn.model.StatusColumn;
import com.example.teamStatusColumn.model.TeamStatusColumn;
import com.example.teamStatusColumn.repository.StatusColumnRepository;
import com.example.teamStatusColumn.repository.TeamStatusColumnRepository;

@Service
@RequiredArgsConstructor
public class TeamStatusColumnService {

    private final StatusColumnRepository statusColumnRepository;
    private final TeamStatusColumnRepository teamStatusColumnRepository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        // statusColumnRepository.save(statusColumn);
        return true;
    }

    public List<TeamStatusColumn> getTeamStatusColumn(Integer teamId) {
        return teamStatusColumnRepository.findAllByTeamId(teamId);
    }

    public Boolean initDefaultTeamStatusColumn(Integer teamId) {
        var defaultTeamStatusColumn = TeamStatusColumn
                .initDefaultTeamStatusColumn(teamId);
        teamStatusColumnRepository.saveAll(defaultTeamStatusColumn);
        return true;
    }
}
