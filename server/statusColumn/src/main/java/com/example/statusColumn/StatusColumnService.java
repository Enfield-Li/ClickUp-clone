package com.example.statusColumn;

import com.example.statusColumn.model.StatusColumn;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatusColumnService {

    private final StatusColumnRepository statusColumnRepository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        statusColumnRepository.save(statusColumn);
        return true;
    }
}
