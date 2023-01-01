package com.example.teamStatusColumn;

import lombok.RequiredArgsConstructor;
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

    public Boolean initDefaultTeamStatusColumn(Integer teamId) {
        var defaultTeamStatusColumn = TeamStatusColumn
                .initDefaultTeamStatusColumn(teamId);
        teamStatusColumnRepository.saveAll(defaultTeamStatusColumn);
        return true;
    }
}
