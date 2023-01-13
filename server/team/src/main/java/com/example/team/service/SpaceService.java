package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository repository;
    private final EntityManager entityManager;
    private final UserInfoService userInfoService;

    @Transactional
    public Space createSpace(CreateSpaceDTO createSpaceDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();
        var space = Space.convertFromCreateSpaceDTO(createSpaceDTO, userInfo);

        // bind team
        var teamReference = findTeamReference(createSpaceDTO.teamId());
        teamReference.addSpace(space);

        return repository.save(space);
    }

    private Team findTeamReference(Integer teamId) {
        return entityManager.getReference(Team.class, teamId);
    }

}
