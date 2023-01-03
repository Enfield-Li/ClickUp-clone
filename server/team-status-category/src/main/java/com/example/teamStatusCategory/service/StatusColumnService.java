package com.example.teamStatusCategory.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.teamStatusCategory.dto.UpdateStatusColumnColorDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnOrderIndexDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnTitleDTO;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.repository.StatusColumnRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatusColumnService {

    private final StatusColumnRepository repository;

    public Boolean createStatusColumn(StatusColumn statusColumn) {
        return null;
    }

    @Transactional
    public Boolean updateStatusColumnTitle(UpdateStatusColumnTitleDTO dto) {
        var id = dto.id();
        var title = dto.title();

        var rowsAffected = repository
                .updateStatusColumnTitle(id, title);
        return rowsAffected > 0;
    }

    @Transactional
    public Boolean updateStatusColumnColor(UpdateStatusColumnColorDTO dto) {
        var id = dto.id();
        var color = dto.color();

        var rowsAffected = repository
                .updateStatusColumnColor(id, color);
        return rowsAffected > 0;
    }

    @Transactional
    public Boolean updateStatusColumnOrderIndex(
            UpdateStatusColumnOrderIndexDTO dto) {
        var id = dto.id();
        var orderIndex = dto.orderIndex();

        var rowsAffected = repository
                .updateStatusColumnOrderIndex(id, orderIndex);
        return rowsAffected > 0;
    }

    public Boolean deleteStatusColumn(Integer id) {
        repository.deleteById(id);
        return true;
    }
}
