package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

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

    @Transactional
    public FolderCategory createSpace(CreateFolderDTO CreateFolderDTO) {

        return null;
        // return repository.save(space);
    }

    public FolderCategory createFolder(CreateFolderDTO createSpaceDTO) {
        return repository.save(
                FolderCategory.convertFromCreateFolderDTO(createSpaceDTO));
    }

    private Space findTeamReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }
}
