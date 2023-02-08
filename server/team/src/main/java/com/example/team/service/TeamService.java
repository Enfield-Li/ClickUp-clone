package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Set;

import static com.example.amqp.ExchangeKey.authorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository repository;
    private final EntityManager entityManager;
    private final SpaceRepository spaceRepository;
    private final UserInfoService userInfoService;
    private final StatusCategoryClient statusCategoryClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    @Transactional
    public Set<Team> getAllTeams(Integer teamId) {
        verifyTeamExist(teamId);
        var userId = userInfoService.getCurrentUserInfo().getUserId();
        return repository.findByMembersUserId(userId);
    }

    @Transactional
    public Team createTeam(CreateTeamDTO createTeamDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();

        // Init team
        var initTeam = Team.initTeamCreation(createTeamDTO, userInfo);
        var team = repository.save(initTeam);

        // Init statusCategory
        var teamId = team.getId();
        var defaultStatusCategoryId = statusCategoryClient
                .initStatusCategoryForTeam(teamId);

        // Init space
        var initSpace = Space.initTeamSpace(defaultStatusCategoryId, userInfo);
        team.addSpace(initSpace);
        spaceRepository.save(initSpace);

        // publish user teamAmount + 1
        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfo.getId(), teamId, true);
        rabbitMQMessageProducer.publish(
                internalExchange,
                authorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        return team;
    }

    @Transactional
    public Boolean deleteTeam(Integer teamId) {
        verifyTeamExist(teamId);

        var team = entityManager.getReference(Team.class, teamId);
        team.removeAllMembers();

        entityManager.remove(team);
        return true;
    }

    private void verifyTeamExist(Integer teamId) {
        var isTeamExist = repository.existsById(teamId);
        if (!isTeamExist) {
            throw new InvalidRequestException("This team no longer exists");
        }
    }
}
