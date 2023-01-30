package com.example.teamStatusCategory.service;

import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.teamStatusCategory.dto.CreateStatusColumnDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.repository.StatusColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class StatusColumnService {

    private final EntityManager entityManager;
    private final StatusColumnRepository repository;

    @Transactional
    public Integer createStatusColumn(
            CreateStatusColumnDTO dto) {
        var title = dto.title();
        var color = dto.color();
        var orderIndex = dto.orderIndex();
        var categoryId = dto.statusCategoryId();
        var statusColumn = StatusColumn.builder().title(title)
                .color(color).orderIndex(orderIndex).build();

        var statusCategory = getStatusCategoryReference(categoryId);
        statusCategory.addStatusColumn(statusColumn);

        return repository.save(statusColumn).getId();
    }

    @Transactional
    public Boolean updateStatusColumn(UpdateStatusColumnDTO dto) {
        var id = dto.id();
        var title = dto.title();
        var color = dto.color();
        var orderIndex = dto.orderIndex();

        var statusColumn = getStatusColumnReference(id);
        statusColumn.setTitle(title);
        statusColumn.setColor(color);
        statusColumn.setOrderIndex(orderIndex);

        return true;
    }

    @Transactional
    public Boolean deleteStatusColumn(Integer id) {
        var rowsAffected = repository.deleteStatusColumnById(id);
        if (rowsAffected == 0) {
            throw new InternalErrorException(
                    String.format("Failed to delete StatusColumn with id: %s", id));
        }

        return rowsAffected > 0;
    }

    private StatusCategory getStatusCategoryReference(Integer id) {
        try {
            return entityManager.getReference(StatusCategory.class, id);
        } catch (EntityNotFoundException e) {
            throw new InternalErrorException(
                    String.format("StatusCategory with id: %s not found", id));
        }
    }

    private StatusColumn getStatusColumnReference(Integer id) {
        try {
            return entityManager.getReference(StatusColumn.class, id);
        } catch (EntityNotFoundException e) {
            throw new InternalErrorException(
                    String.format("StatusColumn with id: %s not found", id));
        }
    }
}
