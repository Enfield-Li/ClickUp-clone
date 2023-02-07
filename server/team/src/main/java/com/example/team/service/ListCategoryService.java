package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateListDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.model.UserInfo;
import com.example.team.repository.ListCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.amqp.ExchangeKey.teamActivityRoutingKey;

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
        var updateTeamActivityDTO = new UpdateTeamActivityDTO(
                teamId, spaceId, null,
                listId, userInfo.getUserId());
        rabbitMQMessageProducer.publish(
                internalExchange,
                teamActivityRoutingKey,
                updateTeamActivityDTO);

        return listCategory;
    }

    @Transactional
    public void updateDefaultStatusCategoryId(
            UpdateListCategoryDefaultStatusCategoryIdDTO dto) {
        var listCategoryId = dto.listCategoryId();
        var statusCategoryId = dto.statusCategoryId();

        var listCategory = repository.findById(listCategoryId)
                .orElse(null);

        if (listCategory != null) {
            listCategory.setDefaultStatusCategoryId(statusCategoryId);
            return;
        }

        log.error("update failed, cannot find listCategory");
    }

    private FolderCategory findFolderReference(Integer FolderCategoryId) {
        return entityManager.getReference(
                FolderCategory.class, FolderCategoryId);
    }

    @Transactional
    public Boolean deleteListCategory(
            Integer listCategoryId,
            UpdateTeamActivityDTO updateTeamActivityDTO) {
        var isListCategoryExists = repository.existsById(listCategoryId);
        if (!isListCategoryExists) {
            throw new InvalidRequestException("This list no longer exists");
        }

        var listCategory = entityManager.getReference(
                ListCategory.class, listCategoryId);
        var folderId = listCategory.getParentFolderId();
        var spaceId = listCategory.getSpaceId();
        var userId = listCategory.getCreatorId();

        if (folderId != null) {
            var folderCategory = entityManager.find(
                    FolderCategory.class, folderId);
            folderCategory.removeListCategory(listCategory);
        }

        var space = entityManager.getReference(Space.class, spaceId);
        space.removeListCategory(listCategory);

        var user = entityManager.getReference(UserInfo.class, userId);
        user.removeJoinedListCategory(listCategory);

        entityManager.remove(listCategory);

        rabbitMQMessageProducer.publish(
                internalExchange,
                teamActivityRoutingKey,
                updateTeamActivityDTO);
        return true;
    }

    private Space findSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

}
