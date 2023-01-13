package com.example.team.service;

import static com.example.amqp.ExchangeKey.AuthorizationRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.Set;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.UserCredentials;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.teamActivity.TeamActivityClient;
import com.example.clients.teamActivity.TeamActivityDTO;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalDataIntegrityException;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.TeamAndActivityDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;
import com.example.team.repository.TeamRepository;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class TeamServiceTest implements WithAssertions {

    TeamService underTest;

    @Mock
    TeamRepository teamRepository;

    @Mock
    SpaceRepository spaceRepository;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    TeamActivityClient teamActivityClient;

    @Mock
    StatusCategoryClient statusCategoryClient;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<Team> teamArgCaptor;

    @Captor
    ArgumentCaptor<String> stringCaptor;

    @Captor
    ArgumentCaptor<Space> spaceCaptor;

    @Captor
    ArgumentCaptor<UpdateUserJoinedTeamsDTO> updateUserJoinedTeamsDTOCaptor;

    @Captor
    ArgumentCaptor<CreateTeamActivityDTO> updateDefaultTeamInCreationDTOCaptor;

    UserCredentials userCredentials = new UserCredentials(1, "mockUser");

    @BeforeEach
    void setUp() {
        // underTest = new TeamService(
        //         teamRepository,
        //         spaceRepository,
        //         teamActivityClient,
        //         statusCategoryClient,
        //         rabbitMQMessageProducer);
        // SecurityContextHolder.setContext(securityContext);
        // given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        // given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(userCredentials);
    }

    // @Test
    // void test_create_team_should_pass() {
    //     // given
    //     var teamId = 11;
    //     var spaceId = 33;
    //     var teamName = "name";
    //     var teamColor = "color";
    //     var teamAvatar = "avatar";
    //     var expectedDefaultStatusCategoryId = 22;
    //     var expectedTeamActivity = new TeamActivityDTO(
    //             11, null, spaceId, teamId, userCredentials.userId(), null);

    //     var team = Team.builder().id(teamId).build();
    //     var space = Space.builder().id(spaceId).build();
    //     var createTeamDTO = new CreateTeamDTO(teamName, teamColor, teamAvatar);

    //     var expectedUpdateDefaultTeamInCreationDTO = new CreateTeamActivityDTO(
    //             teamId, spaceId);
    //     var expectedUpdateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
    //             userCredentials.userId(), teamId, true);

    //     given(teamRepository.save(any())).willReturn(team);
    //     given(teamActivityClient.createTeamActivity(any()))
    //             .willReturn(expectedTeamActivity);

    //     given(spaceRepository.save(any())).willReturn(space);
    //     given(statusCategoryClient.initStatusCategoryForTeam(any()))
    //             .willReturn(expectedDefaultStatusCategoryId);

    //     // when
    //     var actualResult = underTest.createTeam(createTeamDTO);

    //     // then
    //     assertThat(actualResult).isEqualTo(true);

    //     //      assert param
    //     verify(teamActivityClient).createTeamActivity(
    //             updateDefaultTeamInCreationDTOCaptor.capture());
    //     var capturedUpdateDefaultTeamInCreationDTOValue = updateDefaultTeamInCreationDTOCaptor
    //             .getValue();
    //     assertThat(capturedUpdateDefaultTeamInCreationDTOValue)
    //             .isEqualTo(expectedUpdateDefaultTeamInCreationDTO);

    //     verify(rabbitMQMessageProducer).publish(
    //             stringCaptor.capture(),
    //             stringCaptor.capture(),
    //             updateUserJoinedTeamsDTOCaptor.capture());
    //     var stringValues = stringCaptor.getAllValues();
    //     assertThat(stringValues).isEqualTo(List.of(
    //             internalExchange, AuthorizationRoutingKey));

    //     var capturedUpdateUserJoinedTeamsDTOValue = updateUserJoinedTeamsDTOCaptor
    //             .getValue();
    //     assertThat(capturedUpdateUserJoinedTeamsDTOValue)
    //             .isEqualTo(expectedUpdateUserJoinedTeamsDTO);

    //     //      assert relationship
    //     verify(spaceRepository).save(spaceCaptor.capture());
    //     var capturedSpaceValue = spaceCaptor.getValue();
    //     assertThat(capturedSpaceValue.getTeam()).isEqualTo(team);

    //     assertThat(team.getSpaces()).hasSizeGreaterThan(0);
    // }

}
