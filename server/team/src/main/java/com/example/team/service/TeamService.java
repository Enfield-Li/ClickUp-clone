package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.InitTeamUIState;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.task.InitTasksInRegistrationDTO;
import com.example.clients.task.TaskClient;
import com.example.clients.team.CreateTeamDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.Set;

import static com.example.amqp.ExchangeKey.*;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TaskClient taskClient;
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
    public InitTeamUIState initTeamInRegistration(CreateTeamDTO createTeamDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();

        // Init team
        var initTeam = Team.createTeam(createTeamDTO, userInfo);
        var team = repository.saveAndFlush(initTeam);

        // Init statusCategory
        var teamId = team.getId();
        var statusCategoryDTO = statusCategoryClient
                .initDefaultStatusCategoryInRegistration(teamId);

        // Init space
        var defaultStatusCategoryId = statusCategoryDTO.id();
        var initSpace = Space.initSpaceInRegistration(
                defaultStatusCategoryId, userInfo);
        team.addSpace(initSpace);
        var space = spaceRepository.saveAndFlush(initSpace);

        // Init tasks for listCategory
        var listCategoryId = space.getListCategories()
                .stream().toList().get(0).getId();
        var initTasksInRegistrationDTO = new InitTasksInRegistrationDTO(
                listCategoryId,
                statusCategoryDTO);
        var isTaskCreated = taskClient
                .initTaskInRegistration(initTasksInRegistrationDTO);
        if (!isTaskCreated) {
            throw new InternalErrorException("Failed to create task");
        }

        return new InitTeamUIState(
                team.getId(), space.getId(), listCategoryId);
    }

    @Transactional
    public Team createTeam(CreateTeamDTO createTeamDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();

        // Init team
        var initTeam = Team.createTeam(createTeamDTO, userInfo);
        var team = repository.save(initTeam);

        // Init statusCategory
        var teamId = team.getId();
        var defaultStatusCategoryId = statusCategoryClient
                .initStatusCategoryForTeam(teamId);

        // Init space
        var initSpace = Space.initSpaceInCreateTeam(
                defaultStatusCategoryId, userInfo);
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
        Set<Integer> listIds = new HashSet<>();

        var team = entityManager.find(Team.class, teamId);
        team.getSpaces().forEach(space -> {
            space.getListCategories().forEach(listCategory -> {
                listIds.add(listCategory.getId());
            });
            space.getFolderCategories().forEach(folderCategory -> {
                folderCategory.getAllLists().forEach(listCategory -> {
                    listIds.add(listCategory.getId());
                });
            });
        });

        team.removeAllMembers();
        entityManager.remove(team);

        // publish event for delete task
        rabbitMQMessageProducer.publish(
                internalExchange,
                deleteTasksRoutingKey,
                listIds);
        return true;
    }

    private void verifyTeamExist(Integer teamId) {
        var isTeamExist = repository.existsById(teamId);
        if (!isTeamExist) {
            throw new InvalidRequestException("This team no longer exists");
        }
    }
}
