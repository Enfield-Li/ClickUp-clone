package com.example.teamStatusCategory.service;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnColorDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnOrderIndexDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnTitleDTO;
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

    @Transactional
    public Boolean updateStatusColumnTitle(UpdateStatusColumnTitleDTO dto) {
        var id = dto.id();
        var title = dto.title();

        var rowsAffected = statusColumnRepository
                .updateStatusColumnTitle(id, title);
        return rowsAffected > 0;
    }

    @Transactional
    public Boolean updateStatusColumnColor(UpdateStatusColumnColorDTO dto) {
        var id = dto.id();
        var color = dto.color();

        var rowsAffected = statusColumnRepository
                .updateStatusColumnColor(id, color);
        return rowsAffected > 0;
    }

    @Transactional
    public Boolean updateStatusColumnOrderIndex(
            UpdateStatusColumnOrderIndexDTO dto) {
        var id = dto.id();
        var orderIndex = dto.orderIndex();

        var rowsAffected = statusColumnRepository
                .updateStatusColumnOrderIndex(id, orderIndex);
        return rowsAffected > 0;
    }
}
