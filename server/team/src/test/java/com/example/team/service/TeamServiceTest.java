package com.example.team.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import com.example.team.dto.CreateTeamDTO;

import org.assertj.core.api.WithAssertions;

import static org.mockito.BDDMockito.given;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.jwt.UserCredentials;
import com.example.clients.panelActivity.PanelActivityClient;
import com.example.team.model.Team;
import com.example.team.repository.TeamRepository;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class TeamServiceTest implements WithAssertions {

    TeamService underTest;

    @Mock
    SpaceService spaceService;

    @Mock
    TeamRepository repository;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    PanelActivityClient panelActivityClient;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<Team> teamArgCaptor;

    UserCredentials userCredentials = new UserCredentials(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new TeamService(spaceService, repository,
                panelActivityClient, rabbitMQMessageProducer);
        SecurityContextHolder.setContext(securityContext);
        given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(userCredentials);
    }

    @Test
    void test_create_team() {
        // given
        var teamName = "name";
        var teamColor = "color";
        var teamAvatar = "avatar";
        var createTeamDTO = new CreateTeamDTO(teamName, teamColor, teamAvatar);

        // when
        // then

    }

    @Test
    void testGetAllTeams() {
        // given
        // when
        // then
    }

    @Test
    void testTest() {
        // given
        // when
        // then
    }
}
