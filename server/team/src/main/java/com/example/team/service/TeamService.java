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
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.CreateTeamResponseDTO;
import com.example.team.dto.TeamAndActivityDTO;
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

    private final TeamRepository teamRepository;
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

    public TeamAndActivityDTO getAllTeams() {
        var userId = getCurrentUserInfo().userId();

        var teams = teamRepository.findByMembersUserId(userId);
        if (teams.isEmpty()) {
            throw new InvalidRequestException(
                    "Let's create or join a Workspace first!");
        }

        var teamActivity = teamActivityClient.getTeamActivity();
        // validateTeamsAndPanelActivity(panelActivityDTO, teams);
        return new TeamAndActivityDTO(teams, teamActivity);
    }

    @Transactional(rollbackFor = {
            Exception.class, InternalDataIntegrityException.class })
    public CreateTeamResponseDTO createTeam(CreateTeamDTO createTeamDTO) {
        var userInfo = getCurrentUserInfo();

        // Init team
        var initTeam = Team.initTeamCreation(createTeamDTO, userInfo);
        var team = teamRepository.save(initTeam);

        // Init space
        var teamId = team.getId();
        var defaultStatusCategoryId = (Integer) statusCategoryClient
                .initStatusCategoryForTeam(teamId);
        var initSpace = Space.initSpace(defaultStatusCategoryId, team);
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

    // private void validateTeamsAndPanelActivity(
    //         PanelActivityDTO panelActivityDTO, List<Team> teams) {
    //     try {
    //         var ids = teams.stream().map(Team::getId).collect(
    //                 Collectors.toList());
    //         var validateResult = panelActivityDTO.teamActivities().stream()
    //                 .allMatch(teamActivity -> ids
    //                         .contains(teamActivity.teamId()));

    //         if (!validateResult) {
    //             throw new Error();
    //         }
    //     } catch (Exception e) {
    //         log.error(
    //                 "InternalDataIntegrityException, This really shouldn't have happened...");
    //         throw new InternalDataIntegrityException("Data integrity breached");
    //     }
    // }
}
