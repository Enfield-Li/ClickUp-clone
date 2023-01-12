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
        var listCategory = ListCategory.convertFromCreateListDTO(
                createListDTO);

        // bind folder
        var folderCategory = findFolderReference(createListDTO.folderId());
        folderCategory.addListCategory(listCategory);

        // bind space
        var space = findSpaceReference(createListDTO.spaceId());
        space.addCategory(listCategory);

        return repository.save(listCategory);
    }

    private FolderCategory findFolderReference(Integer FolderCategoryId) {
        return entityManager.getReference(
                FolderCategory.class, FolderCategoryId);
    }

    private Space findSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

}
