package com.example.teamStatusCategory.service;

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
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.teamStatusCategory.repository.StatusCategoryRepository;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class StatusCategoryServiceTest implements WithAssertions {

    StatusCategoryService underTest;

    @Mock
    StatusCategoryRepository statusCategoryRepository;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Captor
    ArgumentCaptor<String> stringCaptor;

    UserCredentials userCredentials = new UserCredentials(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new StatusCategoryService(
                statusCategoryRepository);
        SecurityContextHolder.setContext(securityContext);
        given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(userCredentials);
    }

    @Test
    void test_create_status_category_should_pass() {
        // given
        // when 
        // then

    }

    @Test
    void test_create_status_category_() {
        // given
        // when 
        // then

    }

    @Test
    void test_delete_status_category() {
        // given
        // when 
        // then
    }

    @Test
    void test_get_status_category_for_team() {
        // given
        // when 
        // then
    }

    @Test
    void test_init_default_status_category() {
        // given
        // when 
        // then
    }

    @Test
    void test_update_status_category_name() {
        // given
        // when 
        // then
    }
}
