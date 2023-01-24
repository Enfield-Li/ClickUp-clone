package com.example.teamStatusCategory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusCategoryNameDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.repository.StatusCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatusCategoryService {

    private final StatusCategoryRepository repository;

    public List<StatusCategory> getStatusCategoryForTeam(Integer teamId) {
        return repository.findAllByTeamId(teamId);
    }

    public StatusCategory getStatusCategoryForList(Integer id) {
        return repository
                .findById(id)
                .orElseThrow(() -> new InternalErrorException(
                        String.format("StatusCategory with id: $s not found",
                                id)));
    }

    public Integer initDefaultStatusCategory(Integer teamId) {
        var defaultStatusCategories = StatusCategory
                .initDefaultStatusCategories(teamId);
        var statusCategories = repository.saveAll(defaultStatusCategories);

        var defaultStatusCategoryId = statusCategories.get(0).getId();
        return defaultStatusCategoryId;
    }

    public StatusCategory createStatusCategory(
            CreateStatusCategoryDTO createStatusCategoryDTO) {
        var createStatusCategory = StatusCategory
                .convertCreateStatusCategoryDTO(createStatusCategoryDTO);
        return repository.save(createStatusCategory);
    }

    @Transactional
    public Boolean updateStatusCategoryName(UpdateStatusCategoryNameDTO dto) {
        var id = dto.id();
        var name = dto.name();

        var rowsAffected = repository
                .updateStatusCategoryName(id, name);
        return rowsAffected > 0;
    }

    public Boolean deleteStatusCategory(Integer id) {
        repository.deleteById(id);
        return true;
    }

}
