package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
import com.example.team.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.amqp.ExchangeKey.teamActivityRoutingKey;
import static com.example.team.TeamServiceConstants.SPACE_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.SPACE_ORDER_INDEX_CONSTRAINT;

@Log4j2
@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository repository;
    private final EntityManager entityManager;
    private final UserInfoService userInfoService;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    @Transactional
    public Space createSpace(CreateSpaceDTO createSpaceDTO) {
        try {
            var userInfo = userInfoService.getCurrentUserInfo();
            var newSpace = Space.convertFromCreateSpaceDTO(createSpaceDTO, userInfo);

            // bind team
            var teamReference = findTeamReference(createSpaceDTO.teamId());
            teamReference.addSpace(newSpace);

            var space = repository.save(newSpace);

            // publish event
            var spaceId = space.getId();
            var teamId = createSpaceDTO.teamId();
            var listId = space.getListCategories().stream()
                    .findFirst().get().getId();
            var UpdateTeamActivityDTO = new UpdateTeamActivityDTO(
                    teamId, spaceId, null, listId, userInfo.getUserId());
            rabbitMQMessageProducer.publish(
                    internalExchange,
                    teamActivityRoutingKey,
                    UpdateTeamActivityDTO);

            return space;
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains(SPACE_NAME_CONSTRAINT)) {
                throw new InvalidRequestException("Space name already exists!");
            }

            if (e.getMessage().contains(SPACE_ORDER_INDEX_CONSTRAINT)) {
                throw new InvalidRequestException("Space orderIndex already exists!");
            }

            log.error("UnSpecified Space constraint violation");
            throw new InvalidRequestException("UnSpecified Space constraint violation");
        }
    }

    private Team findTeamReference(Integer teamId) {
        return entityManager.getReference(Team.class, teamId);
    }

    @Transactional
    public Boolean deleteSpace(Integer spaceId) {
        var space = entityManager.find(Space.class, spaceId);
        var teamId = space.getTeamId();
        var userId = space.getCreatorId();

        var user = entityManager.getReference(UserInfo.class, userId);
        user.removeJoinedSpace(space);

        var team = entityManager.getReference(Team.class, teamId);
        team.removeSpace(space);

        entityManager.remove(space);
        return true;
    }
}
