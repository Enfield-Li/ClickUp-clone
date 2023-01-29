package com.example.team.service;

import com.example.clients.jwt.UserCredentials;
import com.example.team.model.UserInfo;
import com.example.team.repository.UserInfoRepository;
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

import javax.persistence.EntityManager;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class AuthenticatedSecurityContextTest implements WithAssertions {

    UserInfoService underTest;

    @Mock
    EntityManager entityManager;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    UserInfoRepository userInfoRepository;

    UserCredentials userCredentials = new UserCredentials(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new UserInfoService(
                entityManager,
                userInfoRepository);
        SecurityContextHolder.setContext(securityContext);
        given(SecurityContextHolder.getContext().getAuthentication())
                .willReturn(authentication);
        given(SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).willReturn(userCredentials);
    }

    @Test
    void test_get_current_user_info_should_get_reference() {
        // given
        var userInfo = UserInfo.builder().build();

        given(userInfoRepository.existsById(any())).willReturn(true);
        given(entityManager.getReference(any(), any())).willReturn(userInfo);

        // when
        var actualResult = underTest.getCurrentUserInfo();

        // then
        assertThat(actualResult).isEqualTo(userInfo);
    }

    @Test
    void test_get_current_user_info_should_create_new_user_info() {
        // given 
        given(userInfoRepository.existsById(any())).willReturn(false);

        // when
        var actualResult = underTest.getCurrentUserInfo();

        // then
        assertThat(actualResult.getId()).isNull();
        assertThat(actualResult.getUserId())
                .isEqualTo(userCredentials.userId());
        assertThat(actualResult.getUsername())
                .isEqualTo(userCredentials.username());
    }
}
