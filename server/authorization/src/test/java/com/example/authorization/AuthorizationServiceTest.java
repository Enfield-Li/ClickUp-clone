package com.example.authorization;

import static com.example.clients.UrlConstants.AUTHORIZATION;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.authorization.dto.LoginCredentials;
import com.example.authorization.dto.RegisterCredentials;
import com.example.clients.jwt.AuthenticationFailedField;
import com.example.clients.jwt.AuthenticationFailureException;
import com.example.clients.jwt.JwtUtilities;
import com.example.clients.jwt.RefreshTokenPayload;
import com.example.clients.jwt.UserInfo;

// OutputCaptureExtension.class
@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class AuthorizationServiceTest implements WithAssertions {

    AuthorizationService underTest;
    private final String REFRESH_TOKEN = "refresh_token";

    @Mock
    ApplicationUserRepository repository;

    @Mock
    JwtUtilities jwtUtils;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    HttpSession httpSession;

    @Mock
    HttpServletRequest httpServletRequest;

    @Mock
    Authentication authentication;

    @Captor
    ArgumentCaptor<String> passwordArgCaptor;

    @Captor
    ArgumentCaptor<String> sessionArgCaptor;

    @Captor
    ArgumentCaptor<ApplicationUser> applicationUserArgCaptor;

    @BeforeEach
    void setUp() {
        underTest = new AuthorizationService(
                httpSession, httpServletRequest, jwtUtils, passwordEncoder, repository);
        // SecurityContextHolder.setContext(securityContext);
        // given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        // given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(creator);
    }

    @Test
    void test_register_should_pass() {
        // given
        var username = "user1";
        var password = "password";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";

        var registerCredentials = new RegisterCredentials(username, password, email);
        given(repository.existsByEmail(any())).willReturn(false);
        given(passwordEncoder.encode(any())).willReturn(encodedPassword);
        given(jwtUtils.createRefreshToken(any(), any())).willReturn(refreshToken);
        given(jwtUtils.createAccessToken(any(), any())).willReturn(accessToken);

        // when 
        var userResponse = underTest.register(registerCredentials);

        // then
        verify(passwordEncoder).encode(passwordArgCaptor.capture());
        verify(repository).saveAndFlush(applicationUserArgCaptor.capture());
        verify(httpSession)
                .setAttribute(sessionArgCaptor.capture(), sessionArgCaptor.capture());

        var applicationUserArg = applicationUserArgCaptor.getValue();
        var sessionArgs = sessionArgCaptor.getAllValues();

        assertThat(passwordArgCaptor.getValue()).isEqualTo(password);
        assertThat(applicationUserArg.getPassword()).isEqualTo(encodedPassword);
        assertThat(sessionArgs).isEqualTo(List.of(REFRESH_TOKEN, refreshToken));
        assertThat(userResponse.getAccessToken()).isEqualTo(accessToken);
    }

    @Test
    void test_register_should_fail(CapturedOutput output) {
        // given
        var username = "user1";
        var password = "password";
        var email = "user1@gmail.com";
        var errorMessage = "Email already taken!";
        var registerCredentials = new RegisterCredentials(username, password, email);
        var logMessage = "Email already taken!";

        given(repository.existsByEmail(any())).willReturn(true);

        // when 
        // then
        assertThatThrownBy(() -> underTest.register(registerCredentials))
                .isInstanceOf(AuthenticationFailureException.class)
                .hasMessage(String.format(errorMessage));

        verify(repository, never()).saveAndFlush(any());
        verify(passwordEncoder, never()).encode(any());
        verify(jwtUtils, never()).createRefreshToken(any(), any());
        verify(jwtUtils, never()).createAccessToken(any(), any());
        verify(httpSession, never()).setAttribute(any(), any());
        assertThat(output).contains(logMessage);
    }

    @Test
    void test_login_should_pass() {
        // given
        var id = 1;
        var username = "user1";
        var password = "password";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";
        var tokenVersion = 1;
        var applicationUser = ApplicationUser.builder()
                .id(id)
                .email(email)
                .username(username)
                .password(encodedPassword)
                .refreshTokenVersion(tokenVersion)
                .build();

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";

        var loginCredentials = new LoginCredentials(email, password);

        given(repository.findByEmail(any())).willReturn(Optional.of(applicationUser));
        given(jwtUtils.createRefreshToken(any(), any())).willReturn(refreshToken);
        given(jwtUtils.createAccessToken(any(), any())).willReturn(accessToken);
        given(passwordEncoder.matches(any(), any())).willReturn(true);

        // when 
        var userResponse = underTest.login(loginCredentials);
        verify(httpSession)
                .setAttribute(sessionArgCaptor.capture(), sessionArgCaptor.capture());

        // then
        var sessionArgs = sessionArgCaptor.getAllValues();
        assertThat(sessionArgs).isEqualTo(List.of(REFRESH_TOKEN, refreshToken));
        assertThat(userResponse.getAccessToken()).isEqualTo(accessToken);
        assertThat(userResponse.getId()).isEqualTo(applicationUser.getId());
    }

    @Test
    void test_login_should_fail_for_email_not_found() {
        // given
        var password = "password";
        var email = "user1@gmail.com";

        var loginCredentials = new LoginCredentials(email, password);

        var errorMessage = "Email not found. Click here to create an account!";
        given(repository.findByEmail(any()))
                .willThrow(new AuthenticationFailureException(
                        AuthenticationFailedField.email, errorMessage));

        // when 
        assertThatThrownBy(() -> underTest.login(loginCredentials))
                .isInstanceOf(AuthenticationFailureException.class)
                .hasMessage(errorMessage);

        // then
        verify(jwtUtils, never()).createRefreshToken(any(), any());
        verify(jwtUtils, never()).createAccessToken(any(), any());
        verify(httpSession, never()).setAttribute(any(), any());
    }

    @Test
    void test_login_should_fail_for_password_does_not_match(CapturedOutput output) {
        // given
        var id = 1;
        var username = "user1";
        var password = "password";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";
        var tokenVersion = 1;
        var applicationUser = ApplicationUser.builder()
                .id(id)
                .email(email)
                .username(username)
                .password(encodedPassword)
                .refreshTokenVersion(tokenVersion)
                .build();

        var loginCredentials = new LoginCredentials(email, password);
        var errorMessage = "Incorrect password for this email.";
        var logMessage = "Invalid password";

        given(passwordEncoder.matches(any(), any())).willReturn(false);
        given(repository.findByEmail(any())).willReturn(Optional.of(applicationUser));

        // when 
        assertThatThrownBy(() -> underTest.login(loginCredentials))
                .isInstanceOf(AuthenticationFailureException.class)
                .hasMessage(errorMessage);

        // then
        verify(jwtUtils, never()).createRefreshToken(any(), any());
        verify(jwtUtils, never()).createAccessToken(any(), any());
        verify(httpSession, never()).setAttribute(any(), any());
        assertThat(output).contains(logMessage);
    }

    @Test
    void test_refresh_token_should_pass() {
        // given
        var id = 1;
        var username = "user1";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";
        var tokenVersion = 1;
        var applicationUser = ApplicationUser.builder()
                .id(id)
                .email(email)
                .username(username)
                .password(encodedPassword)
                .refreshTokenVersion(tokenVersion)
                .build();

        var userInfo = new UserInfo(id, username);
        var refreshTokenPayload = new RefreshTokenPayload(id, tokenVersion);

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";
        var newAccessToken = "newAccessToken";
        var newRefreshToken = "newRefreshToken";

        given(httpSession.getAttribute(any())).willReturn(refreshToken);
        given(httpServletRequest.getHeader(AUTHORIZATION)).willReturn(accessToken);
        given(jwtUtils.getUserInfoFromAccessToken(any())).willReturn(userInfo);
        given(jwtUtils.getPayloadFromRefreshToken(any())).willReturn(refreshTokenPayload);
        given(repository.findById(any())).willReturn(Optional.of(applicationUser));

        given(jwtUtils.createRefreshToken(any(), any())).willReturn(newRefreshToken);
        given(jwtUtils.createAccessToken(any(), any())).willReturn(newAccessToken);

        // when 
        var userResponse = underTest.refreshToken();

        // then
        verify(httpSession)
                .setAttribute(sessionArgCaptor.capture(), sessionArgCaptor.capture());
        var sessionArgs = sessionArgCaptor.getAllValues();
        assertThat(sessionArgs).isEqualTo(List.of(REFRESH_TOKEN, newRefreshToken));
        assertThat(userResponse.getAccessToken()).isEqualTo(newAccessToken);
        verify(httpSession, never()).invalidate();
    }

    @Test
    void test_refresh_token_should_fail_for_wrong_token_version(CapturedOutput output) {
        // given
        var id = 1;
        var username = "user1";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";
        var tokenVersion1 = 1;
        var tokenVersion2 = 2;
        var applicationUser = ApplicationUser.builder()
                .id(id)
                .email(email)
                .username(username)
                .password(encodedPassword)
                .refreshTokenVersion(tokenVersion2)
                .build();

        var userInfo = new UserInfo(id, username);
        var refreshTokenPayload = new RefreshTokenPayload(id, tokenVersion1);

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";
        var logMessage = "Token version mismatch.";

        given(httpSession.getAttribute(any())).willReturn(refreshToken);
        given(httpServletRequest.getHeader(AUTHORIZATION)).willReturn(accessToken);
        given(jwtUtils.getUserInfoFromAccessToken(any())).willReturn(userInfo);
        given(jwtUtils.getPayloadFromRefreshToken(any())).willReturn(refreshTokenPayload);
        given(repository.findById(any())).willReturn(Optional.of(applicationUser));

        // when 
        assertThatThrownBy(() -> underTest.refreshToken())
                .isInstanceOf(AuthenticationFailureException.class);

        // then
        verify(jwtUtils, never()).createRefreshToken(any(), any());
        verify(jwtUtils, never()).createAccessToken(any(), any());
        verify(httpSession, never()).setAttribute(any(), any());

        verify(httpSession, times(1)).invalidate();
        assertThat(output).contains(logMessage);
    }

    @Test
    void test_refresh_token_should_fail_for_user_does_not_exist(CapturedOutput output) {
        // given
        var id = 1;
        var username = "user1";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";
        var tokenVersion1 = 1;
        var tokenVersion2 = 2;
        var applicationUser = ApplicationUser.builder()
                .id(id)
                .email(email)
                .username(username)
                .password(encodedPassword)
                .refreshTokenVersion(tokenVersion2)
                .build();

        var userInfo = new UserInfo(id, username);
        var refreshTokenPayload = new RefreshTokenPayload(id, tokenVersion1);

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";
        var logMessage = "Token version mismatch.";

        given(httpSession.getAttribute(any())).willReturn(refreshToken);
        given(httpServletRequest.getHeader(AUTHORIZATION)).willReturn(accessToken);
        given(jwtUtils.getUserInfoFromAccessToken(any())).willReturn(userInfo);
        given(jwtUtils.getPayloadFromRefreshToken(any())).willReturn(refreshTokenPayload);
        given(repository.findById(any())).willThrow(new AuthenticationFailureException());

        // when 
        assertThatThrownBy(() -> underTest.refreshToken())
                .isInstanceOf(AuthenticationFailureException.class);

        // then
        verify(jwtUtils, never()).createRefreshToken(any(), any());
        verify(jwtUtils, never()).createAccessToken(any(), any());
        verify(httpSession, never()).setAttribute(any(), any());
    }

    @Test
    void testChangePassword() {
        // given
        // when 
        // then
    }

    @Test
    void testLogout() {
        // given
        // when 
        // then
    }

}