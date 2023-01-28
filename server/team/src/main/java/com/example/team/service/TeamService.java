package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.TeamActivityClient;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.CreateTeamResponseDTO;
import com.example.team.dto.InitTeamListDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.example.amqp.ExchangeKey.AuthorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository repository;
    private final SpaceRepository spaceRepository;
    private final UserInfoService userInfoService;
    private final TeamActivityClient teamActivityClient;
    private final StatusCategoryClient statusCategoryClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    @Transactional
    public InitTeamListDTO getAllTeams(Integer teamId) {
        var userId = userInfoService.getCurrentUserInfo().getUserId();
        var teamSet = repository.findByMembersUserId(userId);

        var teamActivity = teamActivityClient.getTeamActivity(teamId);

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
                AuthorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        return new CreateTeamResponseDTO(team, teamActivityDTO);
    }
}
