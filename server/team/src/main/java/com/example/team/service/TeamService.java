package com.example.team.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import static com.example.amqp.ExchangeKey.*;
import com.example.clients.panelActivity.PanelActivityClient;
import com.example.clients.panelActivity.PanelActivityDTO;
import com.example.clients.panelActivity.UpdateDefaultTeamInCreationDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.TeamAndPanelActivityDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.TeamRepository;
import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.UserCredentials;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final SpaceService spaceService;
    private final TeamRepository teamRepository;
    private final PanelActivityClient panelActivityClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public UserCredentials getCurrentUserInfo() {
        return (UserCredentials) SecurityContextHolder
                .getContext()
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

        var team = Team.convertFromCreateTeamDTO(createTeamDTO, userInfo);
        var space = Space.builder().team(team)
                .name("space").orderIndex(1).isPrivate(false).build();
        team.setSpaces(Set.of(space));

        teamRepository.saveAndFlush(team);

        // update panel activity
        var updateDefaultTeamInCreationDTO = new UpdateDefaultTeamInCreationDTO(
                team.getId(), space.getId());
        var response = panelActivityClient.updateDefaultTeamInCreation(
                updateDefaultTeamInCreationDTO);

        // publish event
        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfo.userId(), true);
        rabbitMQMessageProducer.publish(
                internalExchange,
                AuthorizationRoutingKey,
                updateUserJoinedTeamsDTO);

        return response;
    }

    private void validateTeamsAndPanelActivity(
            PanelActivityDTO panelActivityDTO, List<Team> teams) {
        var ids = teams.stream().map(Team::getId).collect(Collectors.toList());
        var validateResult = panelActivityDTO.teamActivities().stream()
                .allMatch(teamActivity -> ids.contains(teamActivity.teamId()));
        if (!validateResult) {
            throw new Error("Data integrity breached");
        }
    }
}
