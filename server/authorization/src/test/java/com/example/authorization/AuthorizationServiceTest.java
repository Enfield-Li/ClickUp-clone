package com.example.authorization;

import com.example.authorization.dto.AuthorizationResponseDTO;
import com.example.authorization.dto.LoginUserDTO;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.AuthenticationFailureException;
import com.example.clients.jwt.JwtUtilities;
import com.example.clients.jwt.RefreshTokenPayload;
import com.example.clients.jwt.UserCredentials;
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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

import static com.example.clients.UrlConstants.AUTHORIZATION_HEADER;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

// OutputCaptureExtension.class
@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
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
    ArgumentCaptor<Integer> integerArgCaptor;

    @Captor
    ArgumentCaptor<ApplicationUser> applicationUserArgCaptor;

    @BeforeEach
    void setUp() {
//        underTest = new AuthorizationService(
//                httpSession, httpServletRequest, jwtUtils,
//                passwordEncoder, repository);
    }

    // @Test
    // void test_register_should_pass() {
    //     // given
    //     var userId = 2;
    //     var username = "user1";
    //     var joinedTeamCount = 0;
    //     var password = "password";
    //     var email = "user1@gmail.com";
    //     var encodedPassword = "encodedPassword";

    //     var accessToken = "accessToken";
    //     var refreshToken = "refreshToken";

    //     var applicationUser = ApplicationUser.builder()
    //             .id(userId)
    //             .email(email)
    //             .color("color")
    //             .username(username)
    //             .password(encodedPassword)
    //             .joinedTeamCount(joinedTeamCount)
    //             .build();
    //     var expectedAuthorizationResponseDTO = AuthorizationResponseDTO
    //             .builder()
    //             .id(userId)
    //             .email(email)
    //             .username(username)
    //             .accessToken(accessToken)
    //             .joinedTeamCount(joinedTeamCount)
    //             .build();

    //     var registerCredentials = new RegisterUserDTO(
    //             username, password, email);
    //     given(repository.existsByEmail(any())).willReturn(false);
    //     given(passwordEncoder.encode(any())).willReturn(encodedPassword);
    //     given(jwtUtils.createRefreshToken(any(), any())).willReturn(
    //             refreshToken);
    //     given(jwtUtils.createAccessToken(any(), any())).willReturn(
    //             accessToken);
    //     given(repository.save(any())).willReturn(applicationUser);

    //     // when 
    //     var userResponse = underTest.register(registerCredentials);

    //     // then
    //     verify(passwordEncoder).encode(passwordArgCaptor.capture());
    //     verify(repository).save(applicationUserArgCaptor.capture());
    //     verify(httpSession).setAttribute(sessionArgCaptor.capture(),
    //             sessionArgCaptor.capture());

    //     var applicationUserArg = applicationUserArgCaptor.getValue();
    //     var sessionArgs = sessionArgCaptor.getAllValues();

    //     assertThat(passwordArgCaptor.getValue()).isEqualTo(password);
    //     assertThat(applicationUserArg.getPassword()).isEqualTo(
    //             encodedPassword);
    //     assertThat(sessionArgs).isEqualTo(List.of(REFRESH_TOKEN, refreshToken));
    //     assertThat(userResponse).isEqualTo(expectedAuthorizationResponseDTO);
    // }

    // @Test
    // void test_register_should_fail(CapturedOutput output) {
    //     // given
    //     var username = "user1";
    //     var password = "password";
    //     var email = "user1@gmail.com";
    //     var errorMessage = "Email already taken!";
    //     var registerCredentials = new RegisterUserDTO(username,
    //             password, email);
    //     var logMessage = "Email already taken!";

    //     given(repository.existsByEmail(any())).willReturn(true);

    //     // when 
    //     // then
    //     assertThatThrownBy(() -> underTest.register(registerCredentials))
    //             .isInstanceOf(AuthenticationFailureException.class)
    //             .hasMessage(String.format(errorMessage));

    //     verify(repository, never()).saveAndFlush(any());
    //     verify(passwordEncoder, never()).encode(any());
    //     verify(jwtUtils, never()).createRefreshToken(any(), any());
    //     verify(jwtUtils, never()).createAccessToken(any(), any());
    //     verify(httpSession, never()).setAttribute(any(), any());
    //     assertThat(output).contains(logMessage);
    // }

    @Test
    void test_login_should_pass() {
        // given 
        var userId = 2;
        var username = "user1";
        var joinedTeamCount = 2;
        var password = "password";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";

        var applicationUser = ApplicationUser.builder()
                .id(userId)
                .email(email)
                .color("color")
                .username(username)
                .password(encodedPassword)
                .joinedTeamCount(joinedTeamCount)
                .build();
        var expectedAuthorizationResponseDTO = AuthorizationResponseDTO
                .builder()
                .id(userId)
                .email(email)
                .username(username)
                .accessToken(accessToken)
                .joinedTeamCount(joinedTeamCount)
                .build();

        var loginCredentials = new LoginUserDTO(email, password);

        given(repository.findByEmail(any())).willReturn(Optional.of(
                applicationUser));
        given(jwtUtils.createRefreshToken(any(), any())).willReturn(
                refreshToken);
        given(jwtUtils.createAccessToken(any(), any())).willReturn(
                accessToken);
        given(passwordEncoder.matches(any(), any())).willReturn(true);

        // when 
        var userResponse = underTest.login(loginCredentials);
        verify(httpSession)
                .setAttribute(sessionArgCaptor.capture(),
                        sessionArgCaptor.capture());

        // then
        var sessionArgs = sessionArgCaptor.getAllValues();
        assertThat(sessionArgs).isEqualTo(List.of(REFRESH_TOKEN, refreshToken));
        assertThat(userResponse).isEqualTo(expectedAuthorizationResponseDTO);
        assertThat(userResponse.getId()).isEqualTo(applicationUser.getId());
    }

    @Test
    void test_login_should_fail_for_email_not_found() {
        // given
        var password = "password";
        var email = "user1@gmail.com";

        var loginCredentials = new LoginUserDTO(email, password);

        var errorMessage = "Email not found. Click here to create an account!";
        given(repository.findByEmail(any())).willReturn(Optional.empty());

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
    void test_login_should_fail_for_password_does_not_match(
            CapturedOutput output) {
        // given
        var id = 1;
        var tokenVersion = 1;
        var username = "user1";
        var password = "password";
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";
        var applicationUser = ApplicationUser.builder()
                .id(id)
                .email(email)
                .username(username)
                .password(encodedPassword)
                .refreshTokenVersion(tokenVersion)
                .build();

        var loginCredentials = new LoginUserDTO(email, password);
        var errorMessage = "Incorrect password for this email.";
        var logMessage = "Invalid password";

        given(passwordEncoder.matches(any(), any())).willReturn(false);
        given(repository.findByEmail(any())).willReturn(Optional.of(
                applicationUser));

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
        var userId = 2;
        var tokenVersion = 1;
        var username = "user1";
        var joinedTeamCount = 3;
        var email = "user1@gmail.com";
        var encodedPassword = "encodedPassword";

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";
        var newAccessToken = "newAccessToken";
        var newRefreshToken = "newRefreshToken";

        var applicationUser = ApplicationUser.builder()
                .id(userId)
                .email(email)
                .color("color")
                .username(username)
                .password(encodedPassword)
                .joinedTeamCount(joinedTeamCount)
                .refreshTokenVersion(tokenVersion)
                .build();
        var expectedAuthorizationResponseDTO = AuthorizationResponseDTO
                .builder()
                .id(userId)
                .email(email)
                .username(username)
                .accessToken(newAccessToken)
                .joinedTeamCount(joinedTeamCount)
                .build();

        var userInfo = new UserCredentials(userId, username);
        var refreshTokenPayload = new RefreshTokenPayload(
                userId, tokenVersion);

        given(httpSession.getAttribute(any())).willReturn(refreshToken);
        given(httpServletRequest.getHeader(AUTHORIZATION_HEADER))
                .willReturn(accessToken);
        given(jwtUtils.getUserInfoFromAccessToken(any())).willReturn(userInfo);
        given(jwtUtils.getPayloadFromRefreshToken(any())).willReturn(
                refreshTokenPayload);
        given(repository.findById(any())).willReturn(Optional.of(
                applicationUser));

        given(jwtUtils.createRefreshToken(any(), any())).willReturn(
                newRefreshToken);
        given(jwtUtils.createAccessToken(any(), any())).willReturn(
                newAccessToken);

        // when 
        var userResponse = underTest.refreshToken();

        // then
        verify(httpSession).setAttribute(sessionArgCaptor.capture(),
                sessionArgCaptor.capture());
        var sessionArgs = sessionArgCaptor.getAllValues();
        assertThat(sessionArgs).isEqualTo(List.of(REFRESH_TOKEN,
                newRefreshToken));
        assertThat(userResponse).isEqualTo(expectedAuthorizationResponseDTO);
        verify(httpSession, never()).invalidate();
    }

    @Test
    void test_refresh_token_should_fail_for_wrong_token_version(
            CapturedOutput output) {
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

        var userInfo = new UserCredentials(id, username);
        var refreshTokenPayload = new RefreshTokenPayload(id, tokenVersion1);

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";
        var logMessage = "Token version mismatch.";

        given(httpSession.getAttribute(any())).willReturn(refreshToken);
        given(httpServletRequest.getHeader(AUTHORIZATION_HEADER))
                .willReturn(accessToken);
        given(jwtUtils.getUserInfoFromAccessToken(any())).willReturn(userInfo);
        given(jwtUtils.getPayloadFromRefreshToken(any())).willReturn(
                refreshTokenPayload);
        given(repository.findById(any())).willReturn(Optional.of(
                applicationUser));

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
    void test_refresh_token_should_fail_for_user_does_not_exist(
            CapturedOutput output) {
        // given
        var id = 1;
        var username = "user1";
        var tokenVersion1 = 1;

        var userInfo = new UserCredentials(id, username);
        var refreshTokenPayload = new RefreshTokenPayload(id, tokenVersion1);

        var accessToken = "accessToken";
        var refreshToken = "refreshToken";

        given(httpSession.getAttribute(any())).willReturn(refreshToken);
        given(httpServletRequest.getHeader(AUTHORIZATION_HEADER))
                .willReturn(accessToken);
        given(jwtUtils.getUserInfoFromAccessToken(any())).willReturn(
                userInfo);
        given(jwtUtils.getPayloadFromRefreshToken(any())).willReturn(
                refreshTokenPayload);
        given(repository.findById(any())).willThrow(
                new AuthenticationFailureException());

        // when 
        assertThatThrownBy(() -> underTest.refreshToken())
                .isInstanceOf(AuthenticationFailureException.class);

        // then
        verify(jwtUtils, never()).createRefreshToken(any(), any());
        verify(jwtUtils, never()).createAccessToken(any(), any());
        verify(httpSession, never()).setAttribute(any(), any());
    }

    @Test
    void test_update_user_joined_team_should_pass() {
        // given
        var userId = 11;
        var teamId = 22;
        var isJoinTeam = false;

        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userId, teamId, isJoinTeam);
        given(repository.updateUserJoinedTeamCount(any(), any(), any()))
                .willReturn(1);

        // when 
        var actualResult = underTest.updateUserJoinedTeam(
                updateUserJoinedTeamsDTO);

        // then
        verify(repository).updateUserJoinedTeamCount(
                integerArgCaptor.capture(),
                integerArgCaptor.capture(),
                integerArgCaptor.capture());
        var integerListArg = integerArgCaptor.getAllValues();

        assertThat(integerListArg).isEqualTo(List.of(userId, teamId, -1));
        assertThat(actualResult).isEqualTo(true);
    }

    @Test
    void test_update_user_leave_team_should_pass() {
        // given
        var userId = 11;
        var teamId = 22;
        var isJoinTeam = true;

        var updateUserJoinedTeamsDTO = new UpdateUserJoinedTeamsDTO(
                userId, teamId, isJoinTeam);
        given(repository.updateUserJoinedTeamCount(any(), any(), any()))
                .willReturn(1);

        // when 
        var actualResult = underTest.updateUserJoinedTeam(
                updateUserJoinedTeamsDTO);

        // then
        verify(repository).updateUserJoinedTeamCount(
                integerArgCaptor.capture(),
                integerArgCaptor.capture(),
                integerArgCaptor.capture());
        var integerListArg = integerArgCaptor.getAllValues();

        assertThat(integerListArg).isEqualTo(List.of(userId, teamId, 1));
        assertThat(actualResult).isEqualTo(true);
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
