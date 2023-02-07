package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateFolderDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.Space;
import com.example.team.repository.FolderCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Set;

import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.amqp.ExchangeKey.teamActivityRoutingKey;

@Log4j2
@Service
@RequiredArgsConstructor
public class FolderCategoryService {

    private final EntityManager entityManager;
    private final UserInfoService userInfoService;
    private final FolderCategoryRepository repository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    @Transactional
    public FolderCategory createFolder(CreateFolderDTO dto) {
        var spaceId = dto.spaceId();
        var userInfo = userInfoService.getCurrentUserInfo();
        var newFolderCategory = FolderCategory
                .convertFromCreateFolderDTO(dto, userInfo);

        // bind space
        var space = getSpaceReference(spaceId);
        space.addFolderCategory(newFolderCategory);
//        space.addListCategory(newFolderCategory.getAllLists());

        var folder = repository.save(newFolderCategory);

        var folderId = folder.getId();
        var teamId = space.getTeamId();

        if (folder.getAllLists().stream().findFirst().isPresent()) {
            var listId = folder.getAllLists().stream().findFirst().get().getId();
            var updateTeamActivityDTO = new UpdateTeamActivityDTO(
                    teamId, spaceId, Set.of(folderId),
                    listId, userInfo.getUserId());
            rabbitMQMessageProducer.publish(
                    internalExchange,
                    teamActivityRoutingKey,
                    updateTeamActivityDTO);
        }

        return folder;
    }

    @Transactional
    public Boolean deleteFolderCategory(
            Integer folderCategoryId,
            UpdateTeamActivityDTO updateTeamActivityDTO) {
        var isFolderCategoryExists = repository.existsById(folderCategoryId);
        if (!isFolderCategoryExists) {
            throw new InvalidRequestException("This folder no longer exists");
        }

        var folderCategory = entityManager.getReference(
                FolderCategory.class, folderCategoryId);
        folderCategory.removeAllListCategories();
        folderCategory.removeAllMembers();

        var spaceId = folderCategory.getSpaceId();
        var space = entityManager.getReference(Space.class, spaceId);
        space.removeFolderCategory(folderCategory);

        entityManager.remove(folderCategory);

        rabbitMQMessageProducer.publish(
                internalExchange,
                teamActivityRoutingKey,
                updateTeamActivityDTO);
        return true;
    }

    private Space getSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }


}
