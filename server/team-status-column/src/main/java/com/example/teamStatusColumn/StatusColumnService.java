package com.example.teamStatusColumn;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.teamStatusColumn.model.StatusColumn;

@Service
@RequiredArgsConstructor
public class StatusColumnService {

    private final StatusColumnRepository statusColumnRepository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        // statusColumnRepository.save(statusColumn);
        return true;
    }

    public Boolean initTeamStatusColumn(Integer teamId) {
        // statusColumnRepository.save(statusColumn);
        return true;
    }
}
