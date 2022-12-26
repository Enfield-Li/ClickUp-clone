package com.example.panelActivity.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Optional;
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

import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamInCreationDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.model.TeamActivity;
import com.example.panelActivity.repository.PanelActivityRepository;
import com.example.panelActivity.repository.TeamActivityRepository;
import com.example.serviceExceptionHandling.InternalDataIntegrityException;
import com.example.serviceExceptionHandling.InvalidRequestException;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class PanelActivityServiceTest implements WithAssertions {

    PanelActivityService underTest;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    PanelActivityRepository repository;

    @Mock
    TeamActivityRepository teamActivityRepository;

    @Captor
    ArgumentCaptor<PanelActivity> panelActivityArgCaptor;

    UserInfo userInfo = new UserInfo(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new PanelActivityService(teamActivityRepository, repository);
        // SecurityContextHolder.setContext(securityContext);
        // given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        // given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(userInfo);
    }

    @Test
    void test_update_panel_activity_for_init_process() {
        // given 
        var teamId = 11;
        var spaceId = 10;
        var updatePanelActivityDTO = new UpdateDefaultTeamInCreationDTO(teamId, spaceId);

        given(repository.findIdByUserId(any())).willReturn(null);

        // when
        var actualReturn = underTest.updateDefaultTeamInCreation(updatePanelActivityDTO);

        // then
        verify(repository).save(panelActivityArgCaptor.capture());

        var panelActivity = panelActivityArgCaptor.getValue();

        assertThat(panelActivity.getTeamActivities()).hasSize(1);
        assertThat(panelActivity.getTeamActivities())
                .allMatch(teamActivity -> teamActivity.getTeamId().equals(teamId));
        assertThat(panelActivity.getTeamActivities())
                .allMatch(teamActivity -> teamActivity.getSpaceId().equals(spaceId));
        assertThat(panelActivity.getDefaultTeamId()).isEqualTo(teamId);
        assertThat(actualReturn).isEqualTo(true);
    }

    @Test
    void test_update_panel_activity_for_updating_existing_data() {
        // given 
        var teamId = 11;
        var spaceId = 10;
        var panelActivityId = 12;
        var updatePanelActivityDTO = new UpdateDefaultTeamInCreationDTO(teamId, spaceId);

        given(repository.findIdByUserId(any())).willReturn(panelActivityId);

        // when
        var actualReturn = underTest.updateDefaultTeamInCreation(updatePanelActivityDTO);

        // then
        verify(repository, times(1)).updateDefaultTeamId(any(), any());
        verify(teamActivityRepository, times(1)).createNewTeamActivity(any(), any(), any());

        assertThat(actualReturn).isEqualTo(true);
        verify(repository, never()).save(any());
    }

    @Test
    void test_get_panel_activity_should_pass() {
        // given 
        var userId = 11;
        var teamId = 22;
        var teamActivity = TeamActivity.builder().teamId(teamId).build();
        var panelActivity = PanelActivity.builder().defaultTeamId(teamId)
                .teamActivities(Set.of(teamActivity)).build();

        given(repository.findByUserId(any())).willReturn(Optional.of(panelActivity));

        // when
        var actualReturn = underTest.getPanelActivity(userId);

        // then
        assertThat(actualReturn).isEqualTo(panelActivity);
    }

    @Test
    void test_get_panel_activity_should_fail_for_invalid_request() {
        // given 
        var userId = 11;
        var errorMessage = "Invalid request, because either"
                + "1. User's workspace activity has yet been initialized, or "
                + "2. User record no longer exists.";

        given(repository.findByUserId(any())).willReturn(Optional.empty());

        // when
        // then
        assertThatThrownBy(() -> underTest.getPanelActivity(userId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(String.format(errorMessage));
    }

    @Test
    void test_get_panel_activity_should_fail_for_data_integrity(CapturedOutput output) {
        // given 
        var userId = 11;
        var teamId1 = 22;
        var teamId2 = 23;
        var errorMessage = "PanelActivity data integrity breached...";
        var logMessage = "InternalDataIntegrityException, This really shouldn't have happened...";
        var teamActivity = TeamActivity.builder().teamId(teamId1).build();
        var panelActivity = PanelActivity.builder().defaultTeamId(teamId2)
                .teamActivities(Set.of(teamActivity)).build();

        given(repository.findByUserId(any())).willReturn(Optional.of(panelActivity));

        // when
        // then
        assertThatThrownBy(() -> underTest.getPanelActivity(userId))
                .isInstanceOf(InternalDataIntegrityException.class)
                .hasMessage(String.format(errorMessage));
        assertThat(output).contains(logMessage);
    }
}
