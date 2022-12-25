package com.example.panelActivity.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamIdDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.repository.PanelActivityRepository;

public class PanelActivityServiceTest {

    PanelActivityService underTest;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    PanelActivityRepository panelActivityRepository;

    UserInfo userInfo = new UserInfo(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new PanelActivityService(panelActivityRepository);
        SecurityContextHolder.setContext(securityContext);
        given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(userInfo);
    }

    @Test
    void testGetPanelActivity() {
        // given 

        // when
        // then
    }

    @Test
    void test_update_panel_activity_for_init_process() {
        // given 
        var teamId = 11;
        var spaceId = 10;
        var createPanelActivityDTO = new UpdateDefaultTeamIdDTO(teamId, spaceId);

        given(panelActivityRepository.findByUserId(any())).willReturn(Optional.empty());

        // when

        
        
        // then
    }

    @Test
    void test_update_panel_activity_for_updating_existing_data() {
        // given 
        var teamId = 11;
        var spaceId = 10;
        var createPanelActivityDTO = new UpdateDefaultTeamIdDTO(teamId, spaceId);

        given(panelActivityRepository.findByUserId(any())).willReturn(Optional.of(new PanelActivity()));
        // when
        // then
    }
}
