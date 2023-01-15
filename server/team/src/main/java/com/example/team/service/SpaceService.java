package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static com.example.team.TeamServiceConstants.SPACE_TEAM_ID_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.SPACE_TEAM_ID_ORDER_INDEX_CONSTRAINT;
import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;

@Log4j2
@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository repository;
    private final EntityManager entityManager;
    private final UserInfoService userInfoService;

    @Transactional
    public Space createSpace(CreateSpaceDTO createSpaceDTO) {
        try {

            var userInfo = userInfoService.getCurrentUserInfo();
            var space = Space.convertFromCreateSpaceDTO(createSpaceDTO, userInfo);

            // bind team
            var teamReference = findTeamReference(createSpaceDTO.teamId());
            teamReference.addSpace(space);

            return repository.save(space);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null &&
                    e.getMessage().contains(SPACE_TEAM_ID_NAME_CONSTRAINT)) {

            }

            if (e.getMessage() != null &&
                    e.getMessage().contains(SPACE_TEAM_ID_ORDER_INDEX_CONSTRAINT)) {

            }
            return null;
        }
    }

    private Team findTeamReference(Integer teamId) {
        return entityManager.getReference(Team.class, teamId);
    }

}
