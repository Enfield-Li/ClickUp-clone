package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.Set;

import static com.example.amqp.ExchangeKey.deleteTasksRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
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
            var teamId = createSpaceDTO.teamId();
            var userInfo = userInfoService.getCurrentUserInfo();
            var newSpace = Space.convertFromCreateSpaceDTO(createSpaceDTO, userInfo);

            // bind team
            var teamReference = entityManager.getReference(Team.class, teamId);
            teamReference.addSpace(newSpace);

            return repository.save(newSpace);
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

    @Transactional
    public Boolean deleteSpace(Integer spaceId) {
        Set<Integer> listIds = new HashSet<>();
        var isSpaceExists = repository.existsById(spaceId);
        if (!isSpaceExists) {
            throw new InvalidRequestException("This space no longer exists");
        }

        var space = entityManager.find(Space.class, spaceId);
        space.getListCategories().forEach(listCategory -> {
            listIds.add(listCategory.getId());
        });
        space.getFolderCategories().forEach(folderCategory -> {
            folderCategory.getAllLists().forEach(listCategory -> {
                listIds.add(listCategory.getId());
            });
        });
        space.removeAllMembers();
        space.removeAllListCategories();
        space.removeAllFolderCategories();

        var teamId = space.getTeamId();
        var team = entityManager.getReference(Team.class, teamId);
        team.removeSpace(space);

        entityManager.remove(space);

        // publish event for delete task
        rabbitMQMessageProducer.publish(
                internalExchange,
                deleteTasksRoutingKey,
                listIds);
        return true;
    }
}
