package com.example.task.service;


import com.example.clients.jwt.UserCredentials;
import com.example.task.model.UserInfo;
import com.example.task.repository.UserInfoRepository;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class UserInfoServiceTest implements WithAssertions {

    UserInfoService underTest;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    UserInfoRepository userInfoRepository;

    Integer userId = 1;
    UserCredentials userCredentials = new UserCredentials(
            userId, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new UserInfoService(userInfoRepository);
        SecurityContextHolder.setContext(securityContext);
        given(SecurityContextHolder.getContext().getAuthentication())
                .willReturn(authentication);
        given(SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).willReturn(userCredentials);
    }

    @Test
    void test_get_user_credentials_info() {
        var actualResult = underTest.getUserCredentialsInfo();
        assertThat(actualResult).isEqualTo(userCredentials);
    }

    @Test
    void test_get_current_user_info_should_pass() {
        // given
        var userInfo = UserInfo.builder().build();

        given(userInfoRepository.findByUserId(eq(userId)))
                .willReturn(Optional.of(userInfo));

        // when
        var actualResult = underTest.getCurrentUserInfo();

        // then
        assertThat(actualResult).isEqualTo(userInfo);
    }

    @Test
    void test_get_current_user_info_should_create_new_user_info() {
        // given
        given(userInfoRepository.findByUserId(eq(userId)))
                .willReturn(Optional.empty());

        // when
        var actualResult = underTest.getCurrentUserInfo();

        // then
        assertThat(actualResult.getId()).isNull();
        assertThat(actualResult.getUserId()).isEqualTo(userId);
        assertThat(actualResult.getUsername())
                .isEqualTo(userCredentials.username());
    }
}
