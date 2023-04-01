package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.InitTeamUIState;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.statusCategory.StatusCategoryDTO;
import com.example.clients.task.InitTasksInRegistrationDTO;
import com.example.clients.team.CreateTeamDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.model.*;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.OutputCaptureExtension;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.example.amqp.ExchangeKey.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class TeamServiceTest implements WithAssertions {

    TeamService underTest;

    @Mock
    TeamRepository repository;

    @Mock
    UserInfoService userInfoService;

    @Mock
    EntityManager entityManager;

    @Mock
    SpaceRepository spaceRepository;

    @Mock
    StatusCategoryClient statusCategoryClient;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<String> stringCaptor;

    @Captor
    ArgumentCaptor<Set<Integer>> integerSetCaptor;

    @Captor
    ArgumentCaptor<Team> teamCaptor;

    @Captor
    ArgumentCaptor<Space> spaceCaptor;

    @Captor
    ArgumentCaptor<UpdateUserJoinedTeamsDTO> updateUserJoinedTeamsDTOCaptor;

    @BeforeEach
    void setUp() {
        underTest = new TeamService(
                repository,
                entityManager,
                spaceRepository,
                userInfoService,
                statusCategoryClient,
                rabbitMQMessageProducer);
    }

    @Test
    void test_init_team_in_registration() {
        // given
        var color = "green";
        var avatar = "avatar";
        var name = "teamName";
        var createTeamDTO = new CreateTeamDTO(color, avatar, name);

        var spaceId = 47;
        var listCategoryId = 77;
        var listCategory = ListCategory.builder().id(listCategoryId).build();
        var createSpace = Space.builder()
                .id(spaceId).listCategories(Set.of(listCategory)).build();

        var userId = 31;
        var username = "user";
        var userInfo = UserInfo.builder()
                .userId(userId).username(username).build();

        var teamId = 34;
        var statusCategoryId = 7;
        var createdTeam = Team.builder().id(teamId).build();
        var statusCategoryDTO = new StatusCategoryDTO(
                statusCategoryId, "name", teamId, List.of());
        var initTasksInRegistrationDTO = new InitTasksInRegistrationDTO(
                listCategoryId, statusCategoryDTO, userId, username);
        var expectedResult = new InitTeamUIState(
                teamId, spaceId, listCategoryId);

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(repository.saveAndFlush(any())).willReturn(createdTeam);
        given(statusCategoryClient
                .initDefaultStatusCategoryInRegistration(any()))
                .willReturn(statusCategoryDTO);
        given(spaceRepository.saveAndFlush(any())).willReturn(createSpace);

        // when
        var actualResult = underTest.initTeamInRegistration(createTeamDTO);

        // then
        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange),
                eq(initTasksInRegistrationRoutingKey),
                eq(initTasksInRegistrationDTO));

        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_create_team_should_pass() {
        // given
        var userInfoId = 44;
        var teamId = 11;
        var spaceId = 33;
        var teamName = "name";
        var teamColor = "color";
        var teamAvatar = "avatar";
        var expectedDefaultStatusCategoryId = 22;
        var userInfo = UserInfo.builder().id(userInfoId).build();

        var team = Team.builder().id(teamId).build();
        var space = Space.builder().id(spaceId).build();
        var createTeamDTO = new CreateTeamDTO(
                teamName, teamColor, teamAvatar);

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(repository.save(any())).willReturn(team);

        given(spaceRepository.save(any())).willReturn(space);
        given(statusCategoryClient.initStatusCategoryForTeam(any()))
                .willReturn(expectedDefaultStatusCategoryId);

        // when
        var actualTeamResult = underTest.createTeam(createTeamDTO);

        // then
        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange),
                eq(authorizationRoutingKey),
                updateUserJoinedTeamsDTOCaptor.capture());
        var updateUserJoinedTeamsDTOArg = updateUserJoinedTeamsDTOCaptor
                .getValue();
        assertThat(updateUserJoinedTeamsDTOArg)
                .isEqualTo(new UpdateUserJoinedTeamsDTO(
                        userInfoId, teamId, true));

        verify(spaceRepository).save(spaceCaptor.capture());
        var spaceArg = spaceCaptor.getValue();
        assertThat(spaceArg.getDefaultStatusCategoryId())
                .isEqualTo(expectedDefaultStatusCategoryId);
        assertThat(spaceArg.getTeam()).isEqualTo(team);
        assertThat(actualTeamResult.getSpaces()).contains(spaceArg);

        assertThat(actualTeamResult).isEqualTo(team);
    }

    @Test
    void update_space_should_pass() {
        // Given
        var teamId = 1;
        var team = new Team();
        var newColor = "New Color";
        var newAvatar = "New Avatar";
        var newTeamName = "New Team Name";

        Map<String, String> params = new HashMap<>();
        params.put("color", newColor);
        params.put("avatar", newAvatar);
        params.put("name", newTeamName);

        given(entityManager.getReference(eq(Team.class), eq(teamId)))
                .willReturn(team);

        // When
        Boolean actualResult = underTest.updateTeam(teamId, params);

        // Then
        assertThat(actualResult).isTrue();
        assertThat(team.getColor()).isEqualTo(newColor);
        assertThat(team.getAvatar()).isEqualTo(newAvatar);
        assertThat(team.getName()).isEqualTo(newTeamName);
    }

    @Test
    void test_get_all_teams_should_pass() {
        // given
        var teamId = 1;
        var userInfoId = 44;
        Set<Team> teamSet = Set.of(new Team());
        var userInfo = UserInfo.builder().id(userInfoId).build();
        given(repository.existsById(any())).willReturn(true);
        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(repository.findByMembersUserId(any())).willReturn(teamSet);

        // when
        var actualResult = underTest.getAllTeams(teamId);

        // then
        assertThat(actualResult).isEqualTo(teamSet);
    }

    @Test
    void test_get_all_teams_should_fail() {
        // given
        var teamId = 1;
        var errorMessage = "This team no longer exists";
        given(repository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.getAllTeams(teamId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_delete_team_should_pass() {
        // given
        var listId1 = 44;
        var listId2 = 45;
        var listIds = Set.of(listId1, listId2);

        var listCategory1 = ListCategory.builder().id(listId1).build();
        var listCategory2 = ListCategory.builder().id(listId2).build();
        var folder = FolderCategory.builder()
                .allLists(Set.of(listCategory1)).build();
        var space = Space.builder()
                .listCategories(Set.of(listCategory2))
                .folderCategories(Set.of(folder))
                .build();

        var teamId = 3;
        var member = new UserInfo();
        var team = Team.builder().id(teamId).spaces(Set.of(space)).build();
        team.addMember(member);

        given(repository.existsById(any())).willReturn(true);
        given(entityManager.getReference(any(), any())).willReturn(team);

        // when
        var actualResult = underTest.deleteTeam(teamId);

        // then
        verify(entityManager).remove(teamCaptor.capture());
        var capturedTeamValue = teamCaptor.getValue();
        assertThat(capturedTeamValue.getMembers()).isEmpty();

        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange),
                eq(deleteTasksRoutingKey),
                eq(listIds));

        assertThat(team.getMembers()).isEmpty();
        assertThat(actualResult).isEqualTo(true);
    }

    @Test
    void test_delete_team_should_fail() {
        // given
        var teamId = 1;
        var errorMessage = "This team no longer exists";
        given(repository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.deleteTeam(teamId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

}
