package com.example.team.service;

import static com.example.amqp.ExchangeKey.AuthorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;

import java.util.Set;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.UserCredentials;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.teamActivity.TeamActivityClient;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalDataIntegrityException;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.serviceExceptionHandling.exception.ItemNotFoundException;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.InitTeamListDTO;
import com.example.team.dto.TeamAndActivityDTO;
import com.example.team.dto.CreateTeamResponseDTO;
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
    private final TeamActivityClient teamActivityClient;
    private final StatusCategoryClient statusCategoryClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public UserCredentials getCurrentUserInfo() {
        // return new UserCredentials(1, "username");
        return (UserCredentials) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public InitTeamListDTO getAllTeams(Integer teamId) {
        var userId = getCurrentUserInfo().userId();
        var teamSet = repository.findByMembersUserId(userId);

        var isVerified = verifyTeamIdIsInTeamSet(teamSet, userId);
        if (!isVerified) {
            throw new InvalidRequestException(
                    "You don't have access to this team");
        }
        var teamActivity = teamActivityClient.getTeamActivity(teamId);

        return new InitTeamListDTO(teamSet, teamActivity);
    }

    @Transactional
    public CreateTeamResponseDTO createTeam(CreateTeamDTO createTeamDTO) {
        var userInfo = getCurrentUserInfo();

        // Init team
        var initTeam = Team.initTeamCreation(createTeamDTO, userInfo);
        var team = repository.save(initTeam);

        // Init space
        var teamId = team.getId();
        var defaultStatusCategoryId = (Integer) statusCategoryClient
                .initStatusCategoryForTeam(teamId);
        var initSpace = Space.initTeamSpace(defaultStatusCategoryId, team);
        team.setSpaces(Set.of(initSpace));
        var space = spaceRepository.save(initSpace);

        // update team activity
        var createTeamActivityDTO = new CreateTeamActivityDTO(
                team.getId(), space.getId());
        var teamActivityDTO = teamActivityClient.createTeamActivity(
                createTeamActivityDTO);

        // publish user teamAmount + 1
        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfo.userId(), teamId, true);
        rabbitMQMessageProducer.publish(
                internalExchange,
                AuthorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        return new CreateTeamResponseDTO(team, teamActivityDTO);
    }

    private Boolean verifyTeamIdIsInTeamSet(
            Set<Team> teamSet, Integer teamId) {
        return teamSet.stream().filter(team -> team.getId() == teamId)
                .findAny().isPresent();
    }

    public InitTeamListDTO getTeam(Integer teamId) {
        // var userId = getCurrentUserInfo().userId();

        // var team = repository.findById(teamId)
        //         .orElseThrow(() -> new ItemNotFoundException(
        //                 String.format("Team with id: %d does not exist.", teamId)));

        // var isMember = team.isUserMemberOfTeam(userId);
        // if (!isMember) {
        //     throw new InvalidRequestException(
        //             "User don't have access to this resource");
        // }

        // var teamActivityDTO = teamActivityClient.getTeamActivity(teamId);

        // return new TeamResponseDTO(team, teamActivityDTO);
        return null;
    }
}
