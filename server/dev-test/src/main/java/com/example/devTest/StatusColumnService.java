package com.example.devTest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.devTest.model.StatusColumn;

@Service
@RequiredArgsConstructor
public class StatusColumnService {

    private final StatusColumnRepository statusColumnRepository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        statusColumnRepository.save(statusColumn);
        return true;
    }
}
