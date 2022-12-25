package com.example.panelActivity.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.clients.jwt.AuthenticationFailedField;
import com.example.clients.jwt.AuthenticationFailureException;
import com.example.clients.jwt.JwtUtilities;
import com.example.clients.jwt.RefreshTokenPayload;
import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.model.TeamActivity;
import com.example.panelActivity.repository.PanelActivityRepository;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class PanelActivityServiceTest implements WithAssertions {

    PanelActivityService underTest;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    PanelActivityRepository repository;

    @Captor
    ArgumentCaptor<PanelActivity> panelActivityArgCaptor;

    UserInfo userInfo = new UserInfo(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new PanelActivityService(repository);
        // SecurityContextHolder.setContext(securityContext);
        // given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        // given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(userInfo);
    }

    @Test
    void test_update_panel_activity_for_init_process() {
        // given 
        var teamId = 11;
        var spaceId = 10;
        var updatePanelActivityDTO = new UpdateDefaultTeamDTO(teamId, spaceId);

        given(repository.findByUserId(any())).willReturn(Optional.empty());

        // when
        var actualReturn = underTest.updateDefaultTeam(updatePanelActivityDTO);

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
        var updatePanelActivityDTO = new UpdateDefaultTeamDTO(teamId, spaceId);
        var panelActivity = new PanelActivity();
        var expectedNewTeamActivity = TeamActivity.builder()
                .teamId(teamId)
                .spaceId(spaceId)
                .build();

        given(repository.findByUserId(any())).willReturn(Optional.of(panelActivity));

        // when
        var actualReturn = underTest.updateDefaultTeam(updatePanelActivityDTO);

        // then
        assertThat(panelActivity.getDefaultTeamId()).isEqualTo(teamId);
        assertThat(panelActivity.getTeamActivities())
                .contains(expectedNewTeamActivity);
        assertThat(actualReturn).isEqualTo(true);

        verify(repository, never()).save(any());
    }

    @Test
    void testGetPanelActivity() {
        // given 

        // when
        // then
    }

}
