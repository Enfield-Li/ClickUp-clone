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
public class StatusCategoryService {

    private final StatusColumnRepository statusColumnRepository;
    private final StatusCategoryRepository statusCategoryRepository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        // statusColumnRepository.save(statusColumn);
        return true;
    }

    public List<StatusCategory> getStatusCategoryForTeam(Integer teamId) {
        return statusCategoryRepository.findAllByTeamId(teamId);
    }

    public Boolean initDefaultStatusCategory(Integer teamId) {
        var defaultStatusCategories = StatusCategory
                .initDefaultStatusCategories(teamId);
        statusCategoryRepository.saveAll(defaultStatusCategories);
        return true;
    }

    public StatusCategory createStatusCategory(CreateStatusCategoryDTO createStatusCategoryDTO) {
        return null;
    }
}
