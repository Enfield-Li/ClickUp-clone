package com.example.teamStatusCategory.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.task.UpdateTaskStatusOnAddingColumnDTO;
import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.teamStatusCategory.dto.AddStatusColumnDTO;
import com.example.teamStatusCategory.dto.AddStatusColumnResponseDTO;
import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusCategoryNameDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.repository.StatusCategoryRepository;
import com.example.teamStatusCategory.repository.StatusColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import static com.example.amqp.ExchangeKey.*;

@Service
@RequiredArgsConstructor
public class StatusCategoryService {

    private final EntityManager entityManager;
    private final StatusCategoryRepository repository;
    private final StatusColumnRepository statusColumnRepository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public List<StatusCategory> getStatusCategoryForTeam(Integer teamId) {
        return repository.findAllByTeamId(teamId);
    }

    public StatusCategory getStatusCategoryForList(Integer id) {
        return repository
                .findById(id)
                .orElseThrow(() -> new InternalErrorException(
                        String.format("StatusCategory with id: %s not found", id)));
    }

    public Integer initDefaultStatusCategory(Integer teamId) {
        var defaultStatusCategories = StatusCategory
                .initDefaultStatusCategories(teamId);
        var statusCategories = repository.saveAll(defaultStatusCategories);

        var defaultStatusCategoryId = statusCategories.get(0).getId();
        return defaultStatusCategoryId;
    }

    public StatusCategory initDefaultStatusCategoryInRegistration(Integer teamId) {
        var defaultStatusCategories = StatusCategory
                .initDefaultStatusCategories(teamId);
        var statusCategories = repository.saveAll(defaultStatusCategories);

        return statusCategories.get(1);
    }

    public StatusCategory createStatusCategory(
            CreateStatusCategoryDTO createStatusCategoryDTO) {
        var createStatusCategory = StatusCategory
                .convertCreateStatusCategoryDTO(createStatusCategoryDTO);
        return repository.save(createStatusCategory);
    }

    @Transactional
    public AddStatusColumnResponseDTO cloneStatusCategoryForListCategory(
            AddStatusColumnDTO dto) {
        var title = dto.title();
        var color = dto.color();
        var listId = dto.listId();
        var orderIndex = dto.orderIndex();
        var categoryId = dto.statusCategoryId();
        var newStatusColumn = StatusColumn.builder().title(title)
                .color(color).orderIndex(orderIndex).build();

        var originalStatusCategory = repository.findById(categoryId)
                .orElseThrow(() -> new InternalErrorException(
                        "Error when creating statusColumn"));

        // category is already a custom category in list
        if (originalStatusCategory.getTeamId() == null
                && originalStatusCategory.getName() == null) {
            originalStatusCategory.addStatusColumn(newStatusColumn);
            var statusColumn = statusColumnRepository.save(newStatusColumn);
            return new AddStatusColumnResponseDTO(
                    originalStatusCategory.getId(),
                    statusColumn.getId(), null);
        }

        var newStatusCategory = new StatusCategory(originalStatusCategory);
        newStatusCategory.addStatusColumn(newStatusColumn);
        var statusCategory = repository.saveAndFlush(newStatusCategory);

        // update list defaultListCategory
        var updateListCategoryDTO = new UpdateListCategoryDefaultStatusCategoryIdDTO(
                listId, statusCategory.getId());
        rabbitMQMessageProducer.publish(
                internalExchange, teamRoutingKey, updateListCategoryDTO);

        // update task column id
        var statusPairs = new HashMap<Integer, Integer>();
        var updateTaskDTO = new UpdateTaskStatusOnAddingColumnDTO(
                listId, statusPairs);
        originalStatusCategory.getStatusColumns()
                .forEach(originalStatusColumn ->
                        statusCategory.getStatusColumns().forEach(statusColumn -> {
                                    if (Objects.equals(
                                            originalStatusColumn.getTitle(),
                                            statusColumn.getTitle())) {
                                        statusPairs.put(
                                                originalStatusColumn.getId(),
                                                statusColumn.getId()
                                        );
                                    }
                                }
                        ));
        rabbitMQMessageProducer.publish(
                internalExchange,
                updateTaskStatusOnAddingNewColumnRoutingKey,
                updateTaskDTO);

        return new AddStatusColumnResponseDTO(
                statusCategory.getId(), newStatusColumn.getId(), statusPairs);
    }

    @Transactional
    public Boolean updateStatusCategoryName(UpdateStatusCategoryNameDTO dto) {
        var id = dto.id();
        var name = dto.name();

        var statusCategory = getStatusCategoryReference(id);
        statusCategory.setName(name);

        return true;
    }

    public Boolean deleteStatusCategory(Integer id) {
        repository.deleteById(id);
        return true;
    }

    private StatusCategory getStatusCategoryReference(Integer id) {
        return entityManager.getReference(StatusCategory.class, id);
    }
}
