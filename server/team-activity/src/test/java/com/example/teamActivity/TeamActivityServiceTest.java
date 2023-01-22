package com.example.teamActivity;

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
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
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
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.serviceSecurityConfig.AuthenticatedUserContext;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class TeamActivityServiceTest implements WithAssertions {

    TeamActivityService underTest;

    @Mock
    Authentication authentication;

    @Mock
    AuthenticatedUserContext authenticatedUserContext;

    @Mock
    SecurityContext securityContext;

    @Mock
    TeamActivityRepository repository;

    @Captor
    ArgumentCaptor<TeamActivity> teamActivityArgCaptor;

    @Captor
    ArgumentCaptor<String> stringCaptor;

    @Captor
    ArgumentCaptor<Integer> integerCaptor;

    Integer expectedUserId = 5;
    UserCredentials userCredentials = new UserCredentials(
            expectedUserId, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new TeamActivityService(repository, authenticatedUserContext);
    }

    @Test
    void test_create_team_activity() {
        // given
        var teamId = 22;
        var spaceId = 33;
        var expectedResult = new TeamActivity();

        var dto = new CreateTeamActivityDTO(teamId, spaceId);
        given(repository.save(any())).willReturn(expectedResult);
        given(authenticatedUserContext.getCurrentUserId())
                .willReturn(expectedUserId);

        // when 
        var actualResult = underTest.createTeamActivity(dto);

        // then
        verify(repository).save(teamActivityArgCaptor.capture());
        var capturedValue = teamActivityArgCaptor.getValue();

        assertThat(capturedValue.getUserId()).isEqualTo(expectedUserId);
        assertThat(capturedValue.getTeamId()).isEqualTo(teamId);
        assertThat(capturedValue.getSpaceId()).isEqualTo(spaceId);

        assertThat(expectedResult).isEqualTo(actualResult);
    }

    @Test
    void test_update_team_activity_when_create_space() {
        // given
        var teamId = 11;
        var listId = 12;
        var spaceId = 13;

        var dto = new UpdateTeamActivityDTO(teamId, spaceId, null, listId);

        // when
        underTest.updateTeamActivity(dto);

        // then
        verify(repository).updateOpenedSpaceAndList(
                integerCaptor.capture(),
                integerCaptor.capture(),
                integerCaptor.capture());
        var capturedValue = integerCaptor.getAllValues();
        assertThat(capturedValue).isEqualTo(List.of(teamId, spaceId, listId));

        verify(repository, never()).updateOpenedList(any(), any());
        verify(repository, never()).updateOpenedSpace(any(), any());
        verify(authenticatedUserContext, never()).getCurrentUserId();
    }

    // @Test
    // void test_update_team_activity_when_create_folder() {
    //     var teamId = 11;
    //     var listId = 12;
    //     var spaceId = 13;
    //     var folderId = 14;

    //     var dto = new UpdateTeamActivityDTO(teamId, spaceId, null, null);

    //     // when
    //     underTest.updateTeamActivity(dto);

    //     // then
    //     verify(repository).updateOpenedSpace(
    //             integerCaptor.capture(),
    //             integerCaptor.capture());
    //     var capturedValue = integerCaptor.getAllValues();
    //     assertThat(capturedValue).isEqualTo(List.of(teamId, spaceId));

    //     verify(repository, never()).updateOpenedSpaceAndList(any(), any(), any());
    //     verify(repository, never()).updateOpenedList(any(), any());
    //     verify(authenticatedUserContext, never()).getCurrentUserId();
    // }

    // @Test
    // void test_update_team_activity_when_create_list() {
    //     var teamId = 11;
    //     var listId = 12;
    //     var spaceId = 13;
    //     var folderId = 14;

    //     var dto = new UpdateTeamActivityDTO(teamId, spaceId, null, null);

    //     // when
    //     underTest.updateTeamActivity(dto);

    //     // then
    //     verify(repository).updateOpenedSpace(
    //             integerCaptor.capture(),
    //             integerCaptor.capture());
    //     var capturedValue = integerCaptor.getAllValues();
    //     assertThat(capturedValue).isEqualTo(List.of(teamId, spaceId));

    //     verify(repository, never()).updateOpenedSpaceAndList(any(), any(), any());
    //     verify(repository, never()).updateOpenedList(any(), any());
    //     verify(authenticatedUserContext, never()).getCurrentUserId();
    // }

    @Test
    void testUpdateTeamActivityWhen() {

    }

    @Test
    void test_get_team_activity() {

    }

}
