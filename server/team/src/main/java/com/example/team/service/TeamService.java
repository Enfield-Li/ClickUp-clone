package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.TeamActivityClient;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.CreateTeamResponseDTO;
import com.example.team.dto.InitTeamListDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static com.example.amqp.ExchangeKey.*;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository repository;
    private final EntityManager entityManager;
    private final SpaceRepository spaceRepository;
    private final UserInfoService userInfoService;
    private final TeamActivityClient teamActivityClient;
    private final StatusCategoryClient statusCategoryClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    @Transactional
    public InitTeamListDTO getAllTeams(Integer teamId) {
        verifyTeamExist(teamId);

        var userId = userInfoService.getCurrentUserInfo().getUserId();
        var teamSet = repository.findByMembersUserId(userId);

        var teamActivity = teamActivityClient.getTeamActivity(teamId, userId);

        return new InitTeamListDTO(teamSet, teamActivity);
    }

    @Transactional
    public CreateTeamResponseDTO createTeam(CreateTeamDTO createTeamDTO) {
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
        var space = spaceRepository.save(initSpace);

        // update team activity
        var createTeamActivityDTO = new CreateTeamActivityDTO(
                team.getId(), space.getId());
        var teamActivityDTO = teamActivityClient.createTeamActivity(
                createTeamActivityDTO);

        // publish user teamAmount + 1
        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfo.getId(), teamId, true);
        rabbitMQMessageProducer.publish(
                internalExchange,
                authorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        return new CreateTeamResponseDTO(team, teamActivityDTO);
    }

    @Transactional
    public Boolean deleteTeam(
            Integer teamId, UpdateTeamActivityDTO updateTeamActivityDTO) {
        verifyTeamExist(teamId);

        var team = entityManager.getReference(Team.class, teamId);
        var userId = team.getOwnerId();

        var user = entityManager.getReference(UserInfo.class, userId);
        user.removeJoinedTeam(team);

        entityManager.remove(team);

        rabbitMQMessageProducer.publish(
                internalExchange,
                teamActivityRoutingKey,
                updateTeamActivityDTO);
        return true;
    }

    private void verifyTeamExist(Integer teamId) {
        var isTeamExist = repository.existsById(teamId);
        if (!isTeamExist) {
            throw new InvalidRequestException("This team no longer exists");
        }
    }
}
