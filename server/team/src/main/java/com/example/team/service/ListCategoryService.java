package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateListDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.repository.ListCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

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
        } else {
            // bind space
            var space = findSpaceReference(spaceId);
            space.addListCategory(newListCategory);
        }

        return repository.save(newListCategory);
    }

    @Transactional
    public void updateDefaultStatusCategoryId(
            UpdateListCategoryDefaultStatusCategoryIdDTO dto) {
        var listCategoryId = dto.listCategoryId();
        var statusCategoryId = dto.statusCategoryId();

        var listCategory = repository.findById(listCategoryId);

        if (listCategory.isPresent()) {
            listCategory.get().setDefaultStatusCategoryId(statusCategoryId);
            return;
        }

        log.error("update failed, cannot find listCategory");
    }

    private FolderCategory findFolderReference(Integer FolderCategoryId) {
        return entityManager.getReference(
                FolderCategory.class, FolderCategoryId);
    }

    @Transactional
    public Boolean deleteListCategory(Integer listCategoryId) {
        var isListCategoryExists = repository.existsById(listCategoryId);
        if (!isListCategoryExists) {
            throw new InvalidRequestException("This list no longer exists");
        }

        var listCategory = entityManager.getReference(
                ListCategory.class, listCategoryId);
        listCategory.removeAllMembers();

        var spaceId = listCategory.getSpaceId();
        var folderId = listCategory.getParentFolderId();

        if (folderId != null) {
            var folderCategory = entityManager.find(
                    FolderCategory.class, folderId);
            folderCategory.removeListCategory(listCategory);
        } else {
            var space = entityManager.getReference(Space.class, spaceId);
            space.removeListCategory(listCategory);
        }

        entityManager.remove(listCategory);
        return true;
    }

    private Space findSpaceReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

}
