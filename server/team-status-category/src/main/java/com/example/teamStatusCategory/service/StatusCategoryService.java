package com.example.teamStatusCategory.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.task.UpdateTaskOnCreateNewColumnDTO;
import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.teamStatusCategory.dto.AddStatusColumnDTO;
import com.example.teamStatusCategory.dto.AddStatusColumnResponseDTO;
import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusCategoryNameDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.repository.StatusCategoryRepository;
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

    public StatusCategory createStatusCategory(
            CreateStatusCategoryDTO createStatusCategoryDTO) {
        var createStatusCategory = StatusCategory
                .convertCreateStatusCategoryDTO(createStatusCategoryDTO);
        return repository.save(createStatusCategory);
    }

    public AddStatusColumnResponseDTO cloneStatusCategoryForListCategory(
            AddStatusColumnDTO dto) {
        var title = dto.title();
        var color = dto.color();
        var listId = dto.listId();
        var orderIndex = dto.orderIndex();
        var categoryId = dto.statusCategoryId();
        var statusColumn = StatusColumn.builder().title(title)
                .color(color).orderIndex(orderIndex).build();

        var originalStatusCategory = repository.findById(categoryId)
                .orElseThrow(() -> new InternalErrorException(
                        "Error when creating statusColumn"));

        var statusCategory = new StatusCategory(originalStatusCategory);
        statusCategory.addStatusColumn(statusColumn);
        repository.saveAndFlush(statusCategory);

        var updateListCategoryDTO = new UpdateListCategoryDefaultStatusCategoryIdDTO(
                listId, statusCategory.getId());
        rabbitMQMessageProducer.publish(
                internalExchange, teamRoutingKey, updateListCategoryDTO);

        var statusPairs = new HashMap<Integer, Integer>();
        var updateTaskDTO = new UpdateTaskOnCreateNewColumnDTO(listId, statusPairs);
        originalStatusCategory.getStatusColumns()
                .forEach(originalStatusColumn ->
                        statusCategory.getStatusColumns().forEach(newStatusColumn -> {
                                    if (Objects.equals(
                                            originalStatusColumn.getTitle(),
                                            newStatusColumn.getTitle())) {
                                        statusPairs.put(
                                                originalStatusColumn.getId(),
                                                newStatusColumn.getId()
                                        );
                                    }
                                }
                        ));
        rabbitMQMessageProducer.publish(
                internalExchange, taskRoutingKey, updateTaskDTO);

        return new AddStatusColumnResponseDTO(
                statusCategory.getId(), statusColumn.getId());
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
