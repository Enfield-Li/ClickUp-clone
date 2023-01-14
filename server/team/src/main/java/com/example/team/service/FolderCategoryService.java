package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public FolderCategory createFolder(CreateFolderDTO createSpaceDTO) {
        checkUniqueConstraint(createSpaceDTO);

        var userCredentials = userInfoService.getCurrentUserInfo();
        var folderCategory = FolderCategory
                .convertFromCreateFolderDTO(createSpaceDTO, userCredentials);

        // bind space
        var space = findSpaceReference(createSpaceDTO.spaceId());
        space.addCategory(folderCategory);
        space.addListCategory(folderCategory.getAllLists());

        return repository.save(folderCategory);
    }

    private Space findSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

    private void checkUniqueConstraint(CreateFolderDTO createSpaceDTO) {
        var name = createSpaceDTO.name();
        var spaceId = createSpaceDTO.spaceId();
        var orderIndex = createSpaceDTO.orderIndex();

        var isNameExists = repository.existsByNameAndSpaceId(name, spaceId);
        if (isNameExists)
            throw new Error("FolderCategory name already exists");

        var isOrderIndexExists = repository.existsByOrderIndexAndSpaceId(
                orderIndex, spaceId);

        if (isOrderIndexExists)
            throw new Error("FolderCategory orderIndex already exists");
    }
}
