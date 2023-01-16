package com.example.team.service;

import static com.example.amqp.ExchangeKey.AuthorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.TeamActivityClient;
import com.example.clients.teamActivity.TeamActivityDTO;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.CreateTeamResponseDTO;
import com.example.team.dto.InitTeamListDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

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

    public List<Team> teams() {
        return repository.findAll();
    }

    @Transactional
    public InitTeamListDTO getAllTeams(Integer teamId) {
        var userId = userInfoService.getCurrentUserInfo().getUserId();
        var teamSet = repository.findByMembersUserId(userId);

        // var teamActivity = new TeamActivityDTO(1, 1, 1, 1, 1, List.of(1));
        var teamActivity = teamActivityClient.getTeamActivity(teamId);

        return new InitTeamListDTO(teamSet, teamActivity);
    }

    @Transactional
    public CreateTeamResponseDTO createTeam(CreateTeamDTO createTeamDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();

        // Init team
        var initTeam = Team.initTeamCreation(createTeamDTO, userInfo);
        var team = repository.save(initTeam);

        // Init space
        var teamId = team.getId();
        // var defaultStatusCategoryId = 1;
        var defaultStatusCategoryId = statusCategoryClient
                .initStatusCategoryForTeam(teamId);

        var initSpace = Space.initTeamSpace(defaultStatusCategoryId, userInfo);
        team.addSpace(initSpace);
        var space = spaceRepository.save(initSpace);

        // update team activity
        var createTeamActivityDTO = new CreateTeamActivityDTO(
                team.getId(), space.getId());
        // var teamActivityDTO = new TeamActivityDTO(1, 1, 1, 1, 1, List.of(1));
        var teamActivityDTO = teamActivityClient.createTeamActivity(
                createTeamActivityDTO);

        // publish user teamAmount + 1
        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfo.getId(), teamId, true);
        rabbitMQMessageProducer.publish(
                internalExchange,
                AuthorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        System.out.println(createTeamDTO);
        return new CreateTeamResponseDTO(team, teamActivityDTO);
    }
}
