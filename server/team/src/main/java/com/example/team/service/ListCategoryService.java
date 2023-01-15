package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.team.dto.CreateListDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.repository.ListCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ListCategoryService {

    private final EntityManager entityManager;
    private final UserInfoService userInfoService;
    private final ListCategoryRepository repository;

    @Transactional
    public ListCategory createList(CreateListDTO createListDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();
        var listCategory = ListCategory.convertFromCreateListDTO(
                createListDTO, userInfo);

        // bind folder
        if (createListDTO.folderId() != null) {
            var folderCategory = findFolderReference(createListDTO.folderId());
            folderCategory.addListCategory(listCategory);
        }

        // bind space
        var space = findSpaceReference(createListDTO.spaceId());
        space.addListCategory(listCategory);

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
