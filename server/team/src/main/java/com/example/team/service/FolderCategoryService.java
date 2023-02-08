package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
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

        return repository.save(newFolderCategory);
    }

    @Transactional
    public Boolean deleteFolderCategory(Integer folderCategoryId) {
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
        return true;
    }

    private Space getSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }


}
