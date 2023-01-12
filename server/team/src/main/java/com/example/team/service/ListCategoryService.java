package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateListDTO;
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
    public ListCategory createSpace(CreateListDTO CreateListDTO) {

        return null;
        // return repository.save(space);
    }

    private Space findTeamReference(Integer spaceId) {
        return entityManager.getReference(Space.class, spaceId);
    }

}
