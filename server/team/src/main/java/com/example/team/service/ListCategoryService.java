package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateListDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.repository.ListCategoryRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ListCategoryService {

    private final EntityManager entityManager;
    private final ListCategoryRepository repository;

    @Transactional
    public ListCategory createList(CreateListDTO createListDTO) {
        var folderCategory = findFolderReference(createListDTO.folderId());
        var listCategory = ListCategory.convertFromCreateListDTO(
                createListDTO, folderCategory);
        folderCategory.getAllLists().add(listCategory);

        return repository.save(listCategory);
    }

    private FolderCategory findFolderReference(Integer FolderCategoryId) {
        return entityManager.getReference(
                FolderCategory.class, FolderCategoryId);
    }

    private Space findSpaceReference(Integer spaceId) {
        return entityManager.getReference(
                Space.class, spaceId);
    }

}
