package com.example.team.service;

import static com.example.amqp.ExchangeKey.AuthorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.amqp.ExchangeKey.teamStatusColumnRoutingKey;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.UserCredentials;
import com.example.clients.panelActivity.PanelActivityClient;
import com.example.clients.panelActivity.PanelActivityDTO;
import com.example.clients.panelActivity.UpdateDefaultTeamInCreationDTO;
import com.example.serviceExceptionHandling.exception.InternalDataIntegrityException;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.TeamAndPanelActivityDTO;
import com.example.team.model.Team;
import com.example.team.repository.TeamRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamService {

    private final SpaceService spaceService;
    private final TeamRepository teamRepository;
    private final PanelActivityClient panelActivityClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    String logErrorMsg = "InternalDataIntegrityException, This really shouldn't have happened...";

    public UserCredentials getCurrentUserInfo() {
        // return new UserCredentials(1, "username");
        return (UserCredentials) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public TeamAndPanelActivityDTO getAllTeams() {
        var userId = getCurrentUserInfo().userId();

        var teams = teamRepository.findByMembersUserId(userId);
        if (teams.isEmpty()) {
            throw new InvalidRequestException(
                    "Let's create or join a Workspace first!");
        }

        var panelActivityDTO = panelActivityClient.getPanelActivity();
        validateTeamsAndPanelActivity(panelActivityDTO, teams);
        return new TeamAndPanelActivityDTO(teams, panelActivityDTO);
    }

    public Boolean createTeam(CreateTeamDTO createTeamDTO) {
        var userInfo = getCurrentUserInfo();

        var initTeam = Team.initTeamCreation(createTeamDTO, userInfo);

        var team = teamRepository.save(initTeam);
        var space = team.getSpaces().stream().findFirst().get();

        // update panel activity
        var updateDefaultTeamInCreationDTO = new UpdateDefaultTeamInCreationDTO(
                team.getId(), space.getId());
        var response = panelActivityClient.updateDefaultTeamInCreation(
                updateDefaultTeamInCreationDTO);
        if (!response) {
            log.error(logErrorMsg);
            throw new InternalDataIntegrityException("Data integrity breached");
        }

        // publish events
        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfo.userId(), true);
        rabbitMQMessageProducer.publish(
                internalExchange,
                AuthorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        var teamId = team.getId();
        rabbitMQMessageProducer.publish(
                internalExchange,
                teamStatusColumnRoutingKey,
                teamId);

        return true;
    }

    private void validateTeamsAndPanelActivity(
            PanelActivityDTO panelActivityDTO, List<Team> teams) {
        try {
            var ids = teams.stream().map(Team::getId).collect(
                    Collectors.toList());
            var validateResult = panelActivityDTO.teamActivities().stream()
                    .allMatch(teamActivity -> ids
                            .contains(teamActivity.teamId()));

            if (!validateResult) {
                throw new Error();
            }
        } catch (Exception e) {
            log.error(logErrorMsg);
            throw new InternalDataIntegrityException("Data integrity breached");
        }
    }
}
