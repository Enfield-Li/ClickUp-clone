package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.team.CreateTeamDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
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
import java.util.Set;

import static com.example.amqp.ExchangeKey.authorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class TeamServiceTest implements WithAssertions {

    TeamService underTest;

    @Mock
    TeamRepository teamRepository;

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
    ArgumentCaptor<Team> teamCaptor;

    @Captor
    ArgumentCaptor<Space> spaceCaptor;

    @Captor
    ArgumentCaptor<UpdateUserJoinedTeamsDTO> updateUserJoinedTeamsDTOCaptor;

    @BeforeEach
    void setUp() {
//        underTest = new TeamService(
//                teamRepository,
//                entityManager,
//                spaceRepository,
//                userInfoService,
//                statusCategoryClient,
//                rabbitMQMessageProducer);
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
        var createTeamDTO = new CreateTeamDTO(teamName, teamColor, teamAvatar);

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(teamRepository.save(any())).willReturn(team);

        given(spaceRepository.save(any())).willReturn(space);
        given(statusCategoryClient.initStatusCategoryForTeam(any()))
                .willReturn(expectedDefaultStatusCategoryId);

        // when
        var actualResult = underTest.createTeam(createTeamDTO);

        // then
        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange),
                eq(authorizationRoutingKey),
                updateUserJoinedTeamsDTOCaptor.capture());
        var capturedDTOValue = updateUserJoinedTeamsDTOCaptor.getValue();
        assertThat(capturedDTOValue)
                .isEqualTo(new UpdateUserJoinedTeamsDTO(
                        userInfoId, teamId, true));

        verify(spaceRepository).save(spaceCaptor.capture());
        var capturedSpaceValue = spaceCaptor.getValue();
        assertThat(capturedSpaceValue.getDefaultStatusCategoryId())
                .isEqualTo(expectedDefaultStatusCategoryId);
        assertThat(capturedSpaceValue.getTeam()).isEqualTo(team);

        assertThat(actualResult).isEqualTo(team);
        assertThat(actualResult.getSpaces()).contains(capturedSpaceValue);
    }

    @Test
    void test_get_all_teams_should_pass() {
        // given
        var teamId = 1;
        var userInfoId = 44;
        Set<Team> teamSet = Set.of(new Team());
        var userInfo = UserInfo.builder().id(userInfoId).build();
        given(teamRepository.existsById(any())).willReturn(true);
        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(teamRepository.findByMembersUserId(any())).willReturn(teamSet);

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
        given(teamRepository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.getAllTeams(teamId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_delete_team_should_pass() {
        // given
        var teamId = 3;
        var team = new Team();
        var member = new UserInfo();
        team.addMember(member);

        given(teamRepository.existsById(any())).willReturn(true);
        given(entityManager.getReference(any(), any())).willReturn(team);

        // when
        var actualResult = underTest.deleteTeam(teamId);

        // then
        verify(entityManager).remove(teamCaptor.capture());
        var capturedTeamValue = teamCaptor.getValue();
        assertThat(capturedTeamValue.getMembers()).isEmpty();

        assertThat(actualResult).isEqualTo(true);
    }

    @Test
    void test_delete_team_should_fail() {
        // given
        var teamId = 1;
        var errorMessage = "This team no longer exists";
        given(teamRepository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.deleteTeam(teamId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

}
