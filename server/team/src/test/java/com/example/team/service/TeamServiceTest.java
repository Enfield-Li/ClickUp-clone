package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.UserCredentials;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.TeamActivityClient;
import com.example.clients.teamActivity.TeamActivityDTO;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.CreateTeamResponseDTO;
import com.example.team.dto.InitTeamListDTO;
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

import java.util.List;
import java.util.Set;

import static com.example.amqp.ExchangeKey.AuthorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static org.mockito.ArgumentMatchers.any;
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
    SpaceRepository spaceRepository;
    @Mock

    TeamActivityClient teamActivityClient;

    @Mock
    StatusCategoryClient statusCategoryClient;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<String> stringCaptor;

    @Captor
    ArgumentCaptor<Space> spaceCaptor;

    @Captor
    ArgumentCaptor<UpdateUserJoinedTeamsDTO> updateUserJoinedTeamsDTOCaptor;

    @Captor
    ArgumentCaptor<CreateTeamActivityDTO> updateDefaultTeamInCreationDTOCaptor;

    @BeforeEach
    void setUp() {
        underTest = new TeamService(
                teamRepository,
                spaceRepository,
                userInfoService,
                teamActivityClient,
                statusCategoryClient,
                rabbitMQMessageProducer);
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
        var userCredentials = new UserCredentials(1, "mockUser");
        var expectedTeamActivity = new TeamActivityDTO(
                11, null, spaceId, teamId, userCredentials.userId(), null);
        var userInfo = UserInfo.builder().id(userInfoId).build();

        var team = Team.builder().id(teamId).build();
        var space = Space.builder().id(spaceId).build();
        var createTeamDTO = new CreateTeamDTO(teamName, teamColor, teamAvatar);

        var expectedUpdateDefaultTeamInCreationDTO = new CreateTeamActivityDTO(
                teamId, spaceId);
        var expectedUpdateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userInfoId, teamId, true);
        var expectedResult = new CreateTeamResponseDTO(
                team, expectedTeamActivity);

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(teamRepository.save(any())).willReturn(team);
        given(teamActivityClient.createTeamActivity(any()))
                .willReturn(expectedTeamActivity);

        given(spaceRepository.save(any())).willReturn(space);
        given(statusCategoryClient.initStatusCategoryForTeam(any()))
                .willReturn(expectedDefaultStatusCategoryId);

        // when
        var actualResult = underTest.createTeam(createTeamDTO);

        // then
        assertThat(actualResult).isEqualTo(expectedResult);

        //      assert param
        verify(teamActivityClient).createTeamActivity(
                updateDefaultTeamInCreationDTOCaptor.capture());
        var capturedUpdateDefaultTeamInCreationDTOValue = updateDefaultTeamInCreationDTOCaptor
                .getValue();
        assertThat(capturedUpdateDefaultTeamInCreationDTOValue)
                .isEqualTo(expectedUpdateDefaultTeamInCreationDTO);

        verify(rabbitMQMessageProducer).publish(
                stringCaptor.capture(),
                stringCaptor.capture(),
                updateUserJoinedTeamsDTOCaptor.capture());
        var stringValues = stringCaptor.getAllValues();
        assertThat(stringValues).isEqualTo(List.of(
                internalExchange, AuthorizationRoutingKey));

        var capturedUpdateUserJoinedTeamsDTOValue = updateUserJoinedTeamsDTOCaptor
                .getValue();
        assertThat(capturedUpdateUserJoinedTeamsDTOValue)
                .isEqualTo(expectedUpdateUserJoinedTeamsDTO);

        //      assert relationship
        verify(spaceRepository).save(spaceCaptor.capture());
        var capturedSpaceValue = spaceCaptor.getValue();
        assertThat(capturedSpaceValue.getTeam()).isEqualTo(team);

        assertThat(team.getSpaces()).hasSizeGreaterThan(0);
    }

    @Test
    void test_get_all_teams() {
        // given
        var userInfoId = 44;
        var userInfo = UserInfo.builder().id(userInfoId).build();
        var teamActivity = new TeamActivityDTO(1, 1, 1, 1, 1, List.of());
        Set<Team> teamSet = Set.of();
        var expectedResult = new InitTeamListDTO(teamSet, teamActivity);

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(teamRepository.findByMembersUserId(any())).willReturn(teamSet);
        given(teamActivityClient.getTeamActivity(any(), any()))
                .willReturn(teamActivity);

        // when
        var actualResult = underTest.getAllTeams(1);

        // then
        assertThat(actualResult).isEqualTo(expectedResult);
    }
}
