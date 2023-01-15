package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static com.example.team.TeamServiceConstants.SPACE_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.SPACE_ORDER_INDEX_CONSTRAINT;

import com.example.serviceExceptionHandling.exception.InvalidRequestException;
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
                    e.getMessage().contains(SPACE_NAME_CONSTRAINT)) {
                throw new InvalidRequestException("Space name already exists!");
            }
            if (e.getMessage() != null &&
                    e.getMessage().contains(SPACE_ORDER_INDEX_CONSTRAINT)) {
                throw new InvalidRequestException("Space orderIndex already exists!");
            }
            throw new InvalidRequestException("Unhandled Space constraint violation");
        }
    }

    private Team findTeamReference(Integer teamId) {
        return entityManager.getReference(Team.class, teamId);
    }

}
