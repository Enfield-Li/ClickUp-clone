package com.example.teamStatusCategory.service;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.repository.StatusCategoryRepository;
import com.example.teamStatusCategory.repository.StatusColumnRepository;

@Service
@RequiredArgsConstructor
public class StatusColumnService {

    private final StatusColumnRepository statusColumnRepository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        return null;
    }

}
