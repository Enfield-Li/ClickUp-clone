package com.example.teamActivity;

import com.example.clients.jwt.UserCredentials;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.serviceSecurityConfig.UserInfoService;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.OutputCaptureExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class TeamActivityServiceTest implements WithAssertions {

    TeamActivityService underTest;

    @Mock
    UserInfoService userInfoService;

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
        underTest = new TeamActivityService(
                repository, userInfoService);
    }

    @Test
    void test_get_team_activity_should_pass() {
        // given
        var teamId = 56;
        var userId = 4515;
        var expectedTeamActivity = new TeamActivity();
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(expectedTeamActivity));
        given(userInfoService.getCurrentUserId())
                .willReturn(userId);

        // when 
        var actualResult = underTest.getTeamActivity(teamId);

        // then
        assertThat(actualResult).isEqualTo(expectedTeamActivity);
    }

    @Test
    void test_get_team_activity_should_fail() {
        // given
        var teamId = 22;
        var errorMessage = "User's teamActivity somehow disappeared";

        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.empty());

        // when 
        // then
        assertThatThrownBy(() -> underTest.getTeamActivity(teamId))
                .isInstanceOf(InternalErrorException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_create_team_activity_should_pass() {
        // given
        var teamId = 22;
        var spaceId = 33;
        var expectedResult = new TeamActivity();

        var dto = new CreateTeamActivityDTO(teamId, spaceId);
        given(repository.save(any())).willReturn(expectedResult);
        given(userInfoService.getCurrentUserId())
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
    void test_update_team_activity_should_pass_when_open_new_space_id() {
        // given
        var teamId = 11;
        var userId = 319;
        var expectedSpaceId = 13;
        var originalSpaceId = 45;
        var dto = new UpdateTeamActivityDTO(
                teamId, expectedSpaceId, null, null, userId);
        var originalTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(originalSpaceId).build();
        var expectedTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(expectedSpaceId).build();

        given(userInfoService.getCurrentUserId())
                .willReturn(userId);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);
    }

    @Test
    void test_update_team_activity_should_pass_when_update_from_message_queue() {
        // given
        var teamId = 11;
        var userId = 319;
        var expectedSpaceId = 13;
        var originalSpaceId = 45;
        var dto = new UpdateTeamActivityDTO(
                teamId, expectedSpaceId, null, null, userId);
        var originalTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(originalSpaceId).build();
        var expectedTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(expectedSpaceId).build();

        given(userInfoService.getCurrentUserId())
                .willReturn(null);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);
    }


    @Test
    void test_update_team_activity_should_pass_when_open_space_id() {
        // given
        var teamId = 11;
        var userId = 319;
        var expectedSpaceId = 13;
        var dto = new UpdateTeamActivityDTO(
                teamId, expectedSpaceId, null, null, userId);
        var originalTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(null).build();
        var expectedTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(expectedSpaceId).build();

        given(userInfoService.getCurrentUserId())
                .willReturn(userId);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);
    }

    @Test
    void test_update_team_activity_should_pass_when_close_space_id() {
        // given
        var teamId = 11;
        var userId = 319;
        var spaceId = 25;
        var dto = new UpdateTeamActivityDTO(
                teamId, spaceId, null, null, userId);
        var originalTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(spaceId).build();
        var expectedTeamActivity = TeamActivity.builder()
                .teamId(teamId).spaceId(null).build();

        given(userInfoService.getCurrentUserId())
                .willReturn(userId);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);
    }


    @Test
    void test_update_team_activity_should_pass_when_adding_folder_id() {
        // given
        var teamId = 11;
        var userId = 319;
        var spaceId = 45;
        var folderId = 515;
        var originalFolderIds = new HashSet<>(Set.of(11, 22, 33));
        var expectedFolderIds = new HashSet<>(Set.of(11, 22, 33, 515));

        var dto = new UpdateTeamActivityDTO(
                teamId, null, folderId, null, userId);
        var originalTeamActivity = TeamActivity.builder().teamId(teamId)
                .spaceId(null).folderIds(originalFolderIds).build();
        var expectedTeamActivity = TeamActivity.builder().teamId(teamId)
                .spaceId(null).folderIds(expectedFolderIds).build();

        given(userInfoService.getCurrentUserId()).willReturn(userId);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);

    }

    @Test
    void test_update_team_activity_should_pass_when_deleting_folder_id() {
        // given
        var teamId = 11;
        var userId = 319;
        var folderId = 11;
        var originalFolderIds = new HashSet<>(Set.of(11, 22, 33));
        var expectedFolderIds = new HashSet<>(Set.of(22, 33));

        var dto = new UpdateTeamActivityDTO(
                teamId, null, folderId, null, userId);
        var originalTeamActivity = TeamActivity.builder().teamId(teamId)
                .spaceId(null).folderIds(originalFolderIds).build();
        var expectedTeamActivity = TeamActivity.builder().teamId(teamId)
                .spaceId(null).folderIds(expectedFolderIds).build();

        given(userInfoService.getCurrentUserId()).willReturn(userId);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);

    }

    @Test
    void test_update_team_activity_should_pass_when_updating_list_id() {
        // given
        var teamId = 11;
        var userId = 319;
        var expectedListId = 13;
        var originalListId = 45;
        var dto = new UpdateTeamActivityDTO(
                teamId, null, null, expectedListId, userId);
        var originalTeamActivity = TeamActivity.builder().teamId(teamId)
                .spaceId(null).listId(originalListId).build();
        var expectedTeamActivity = TeamActivity.builder().teamId(teamId)
                .spaceId(null).listId(expectedListId).build();

        given(userInfoService.getCurrentUserId()).willReturn(userId);
        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.of(originalTeamActivity));

        // when
        underTest.updateTeamActivity(dto);

        // then
        assertThat(originalTeamActivity).isEqualTo(expectedTeamActivity);
    }

    @Test
    void test_update_team_activity_should_fail() {
        // given
        var teamId = 11;
        var spaceId = 51;
        var dto = new UpdateTeamActivityDTO(teamId, spaceId, null, null, null);
        var errorMessage = "User's teamActivity somehow disappeared";

        given(repository.findByTeamIdAndUserId(any(), any()))
                .willReturn(Optional.empty());

        // when
        // then
        assertThatThrownBy(() -> underTest.updateTeamActivity(dto))
                .isInstanceOf(InternalErrorException.class)
                .hasMessage(errorMessage);
    }
}
