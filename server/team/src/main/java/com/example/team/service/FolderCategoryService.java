package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.example.clients.jwt.UserCredentials;
import com.example.team.dto.CreateFolderDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.Space;
import com.example.team.repository.FolderCategoryRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FolderCategoryService {

    private final EntityManager entityManager;
    private final FolderCategoryRepository repository;

    public UserCredentials getCurrentUserInfo() {
        // return new UserCredentials(1, "username");
        return (UserCredentials) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @Transactional
    public FolderCategory createFolder(CreateFolderDTO createSpaceDTO) {
        var userCredentials = getCurrentUserInfo();
        
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
}
