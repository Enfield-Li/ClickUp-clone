package com.example.panelActivity;

import org.springframework.stereotype.Service;

import com.example.panelActivity.model.PanelActivity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final PanelActivityRepository statusColumnRepository;

    public Boolean createStatusColumn(PanelActivity statusColumn) {
        statusColumnRepository.save(statusColumn);
        return true;
    }
}
