package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository repository;
    private final EntityManager entityManager;

    @Transactional
    public Space createSpace(CreateSpaceDTO createSpaceDTO) {
        var teamReference = findTeamReference(createSpaceDTO.teamId());
        var space = Space.convertFromCreateSpaceDTO(
                createSpaceDTO, teamReference);
        teamReference.addSpace(space);

        return repository.save(space);
    }

    private Team findTeamReference(Integer teamId) {
        return entityManager.getReference(Team.class, teamId);
    }

}
