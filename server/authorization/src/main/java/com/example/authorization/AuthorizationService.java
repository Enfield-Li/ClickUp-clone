package com.example.authorization;

import com.example.authorization.dto.AuthorizationResponseDTO;
import com.example.authorization.dto.LoginUserDTO;
import com.example.authorization.dto.RegisterUserDTO;
import com.example.authorization.dto.RegistrationResponseDTO;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.clients.jwt.AuthenticationFailedField;
import com.example.clients.jwt.AuthenticationFailureException;
import com.example.clients.jwt.JwtUtilities;
import com.example.clients.team.CreateTeamDTO;
import com.example.clients.team.TeamClient;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Objects;

import static com.example.clients.UrlConstants.AUTHORIZATION_HEADER;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final HttpSession session;
    private final TeamClient teamClient;
    private final HttpServletRequest request;

    private final JwtUtilities jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationUserRepository repository;

    private final String REFRESH_TOKEN = "refresh_token";

    @Transactional
    RegistrationResponseDTO register(RegisterUserDTO registerUserDTO) {
        var color = registerUserDTO.color();
        var email = registerUserDTO.email();
        var username = registerUserDTO.username();
        var password = registerUserDTO.password();

        // 1. check if email is taken
        var isEmailTaken = repository.existsByEmail(email);
        if (isEmailTaken) {
            log.error("Email already taken!");
            throw new AuthenticationFailureException(
                    AuthenticationFailedField.email, "Email already taken!");
        }

        // 2. save user
        var encodedPassword = passwordEncoder.encode(password);
        var applicationUser = ApplicationUser.builder()
                .email(email)
                .color(color)
                .username(username)
                .joinedTeamCount(1)
                .password(encodedPassword)
                .build();
        var user = repository.save(applicationUser);

        var green = "rgb(29, 185, 84)";
        var teamName = String.format("%s's Workspace", username);
        var createTeamDTO = new CreateTeamDTO(green, null, teamName);
        var accessToken = jwtUtils.createAccessToken(user.getId(), username);

        var initTeamUIState = teamClient.initTeamInRegistration(
                createTeamDTO, String.format("Bearer %s", accessToken));
        user.setDefaultTeamId(initTeamUIState.teamId());
        repository.save(user);

        // 3. generate refresh token and save to session
        //    generate access token & response
        var userId = user.getId();
        var joinedTeamCount = user.getJoinedTeamCount();

        // store refreshToken in session
        var INITIAL_TOKEN_VERSION = 0;
        var refreshToken = jwtUtils.createRefreshToken(
                userId, INITIAL_TOKEN_VERSION);
        session.setAttribute(REFRESH_TOKEN, refreshToken);

        // response dto
        return RegistrationResponseDTO.builder()
                .id(userId)
                .color(color)
                .email(email)
                .username(username)
                .accessToken(accessToken)
                .joinedTeamCount(joinedTeamCount)
                .initTeamUIState(initTeamUIState)
                .defaultTeamId(initTeamUIState.teamId())
                .build();
    }

    AuthorizationResponseDTO login(LoginUserDTO loginUserDTO) {
        // 1. check user password
        var applicationUser = repository
                .findByEmail(loginUserDTO.email())
                .orElseThrow(() -> new AuthenticationFailureException(
                        AuthenticationFailedField.email,
                        "Email not found. Click here to create an account!"));

        boolean matches = passwordEncoder.matches(
                loginUserDTO.password(), applicationUser.getPassword());
        if (!matches) {
            log.error("Invalid password");
            throw new AuthenticationFailureException(
                    AuthenticationFailedField.password,
                    "Incorrect password for this email.");
        }

        // 3. generate refresh token and save to session
        //    generate access token & response
        var tokenVersion = applicationUser.getRefreshTokenVersion();
        var userResponse = generateResponseAndToken(
                applicationUser, tokenVersion);

        // 4. send access token
        return userResponse;
    }

    AuthorizationResponseDTO refreshToken() {
        // 1. get both tokens
        var accessToken = request.getHeader(AUTHORIZATION_HEADER);
        var refreshToken = (String) session.getAttribute(REFRESH_TOKEN);

        // 2. validate tokens and retrieve payload
        var userIdInAccessToken = jwtUtils.getUserInfoFromAccessToken(
                accessToken);
        var refreshTokenPayload = jwtUtils.getPayloadFromRefreshToken(
                refreshToken);
        var userIdInRefreshToken = refreshTokenPayload.userId();
        var tokenVersion = refreshTokenPayload.tokenVersion();

        // 3. check if token version is valid
        var applicationUser = repository
                .findById(userIdInAccessToken.userId())
                .orElseThrow(AuthenticationFailureException::new);
        var isTokenNotValid = !Objects.equals(tokenVersion, applicationUser
                .getRefreshTokenVersion()) ||
                !userIdInAccessToken.userId().equals(userIdInRefreshToken);
        if (isTokenNotValid) {
            log.error("Token version mismatch.");
            session.invalidate();
            throw new AuthenticationFailureException();
        }

        // 4. generate refresh token and save to session
        //    generate access token & response
        var userResponse = generateResponseAndToken(
                applicationUser, tokenVersion);
        return userResponse;
    }

    @Transactional
    public Boolean updateUserJoinedTeam(
            UpdateUserJoinedTeamsDTO updateUserJoinedTeamsDTO) {
        var userId = updateUserJoinedTeamsDTO.userId();
        var teamId = updateUserJoinedTeamsDTO.teamId();
        var isJoinTeam = updateUserJoinedTeamsDTO.isJoinTeam();

        var rowsAffected = repository
                .updateUserJoinedTeamCount(userId, teamId, isJoinTeam ? 1 : -1);
        return rowsAffected > 0;
    }

    @Transactional
    public Boolean updateUserDefaultTeamId(Integer teamId) {
        var accessToken = request.getHeader(AUTHORIZATION_HEADER);
        var userId = jwtUtils.getUserInfoFromAccessToken(accessToken).userId();

        var user = repository.findById(userId)
                .orElseThrow(() -> new InvalidRequestException(
                        "User with id " + userId + " does not exist"));
        user.setDefaultTeamId(teamId);

        return true;
    }

    void logout() {
        session.invalidate();
        // TODO: invalidate all related tokens
    }

    private AuthorizationResponseDTO generateResponseAndToken(
            ApplicationUser applicationUser, Integer tokenVersion) {
        var userId = applicationUser.getId();
        var color = applicationUser.getColor();
        var email = applicationUser.getEmail();
        var username = applicationUser.getUsername();
        var defaultTeamId = applicationUser.getDefaultTeamId();
        var joinedTeamCount = applicationUser.getJoinedTeamCount();

        // store refreshToken in session
        var refreshToken = jwtUtils.createRefreshToken(userId, tokenVersion);
        session.setAttribute(REFRESH_TOKEN, refreshToken);

        // send accessToken to client
        var accessToken = jwtUtils.createAccessToken(userId, username);

        // response dto
        return AuthorizationResponseDTO.builder()
                .id(userId)
                .color(color)
                .email(email)
                .username(username)
                .accessToken(accessToken)
                .defaultTeamId(defaultTeamId)
                .joinedTeamCount(joinedTeamCount)
                .build();
    }

}
