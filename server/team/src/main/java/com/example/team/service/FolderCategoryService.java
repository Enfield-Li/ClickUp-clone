package com.example.team.service;

import javax.persistence.EntityManager;

import static com.example.amqp.ExchangeKey.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.team.dto.CreateFolderDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.Space;
import com.example.team.repository.FolderCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

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
        var userCredentials = userInfoService.getCurrentUserInfo();
        var newFolderCategory = FolderCategory
                .convertFromCreateFolderDTO(dto, userCredentials);

        // bind space
        var space = getSpaceReference(spaceId);
        space.addFolderCategory(newFolderCategory);
        space.addListCategory(newFolderCategory.getAllLists());

        var folder = repository.save(newFolderCategory);

        var folderId = folder.getId();
        var teamId = space.getTeamId();
        var listId = folder.getAllLists().stream()
                .findFirst().get().getId();
        var UpdateTeamActivityDTO = new UpdateTeamActivityDTO(
                teamId, spaceId, folderId, listId);
        rabbitMQMessageProducer.publish(
                internalExchange,
                TeamActivityRoutingKey,
                UpdateTeamActivityDTO);

        return folder;
    }

    private Space getSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

}
