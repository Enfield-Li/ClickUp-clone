package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateListDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.repository.ListCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static com.example.amqp.ExchangeKey.TeamActivityRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;

@Log4j2
@Service
@RequiredArgsConstructor
public class ListCategoryService {

    private final EntityManager entityManager;
    private final UserInfoService userInfoService;
    private final ListCategoryRepository repository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    @Transactional
    public ListCategory createList(CreateListDTO dto) {
        var name = dto.name();
        var spaceId = dto.spaceId();
        var folderId = dto.folderId();

        var isListNameExists = repository
                .existsByNameAndSpaceIdAndParentFolderId(name, spaceId, null);
        if (isListNameExists && folderId == null) {
            throw new InvalidRequestException("List name taken");
        }

        var userInfo = userInfoService.getCurrentUserInfo();
        var newListCategory = ListCategory.convertFromCreateListDTO(
                dto, userInfo);

        // bind folder
        if (folderId != null) {
            var folderCategory = findFolderReference(folderId);
            folderCategory.addListCategory(newListCategory);
        }

        // bind space
        var space = findSpaceReference(spaceId);
        space.addListCategory(newListCategory);

        var listCategory = repository.save(newListCategory);

        var teamId = space.getTeamId();
        var listId = listCategory.getId();
        var UpdateTeamActivityDTO = new UpdateTeamActivityDTO(
                teamId, null, null, listId, userInfo.getUserId());
        rabbitMQMessageProducer.publish(
                internalExchange,
                TeamActivityRoutingKey,
                UpdateTeamActivityDTO);

        return listCategory;
    }

    private void updateDefaultStatusCategoryId(String i) {

    }

    private FolderCategory findFolderReference(Integer FolderCategoryId) {
        return entityManager.getReference(
                FolderCategory.class, FolderCategoryId);
    }

    private Space findSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

}
