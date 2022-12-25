package com.example.authorization;

import static com.example.clients.UrlConstants.*;

import com.example.authorization.dto.AuthorizationResponseDTO;
import com.example.authorization.dto.LoginCredentials;
import com.example.authorization.dto.RegisterCredentials;
import com.example.clients.jwt.AuthenticationFailedField;
import com.example.clients.jwt.AuthenticationFailureException;
import com.example.clients.jwt.JwtUtilities;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final HttpSession session;
    private final HttpServletRequest request;

    private final JwtUtilities jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationUserRepository repository;

    private final Integer INITIAL_TOKEN_VERSION = 0;
    private final String REFRESH_TOKEN = "refresh_token";

    AuthorizationResponseDTO register(RegisterCredentials registerCredentials) {
        var email = registerCredentials.email();
        var username = registerCredentials.username();
        var password = registerCredentials.password();

        // 1. check if email is taken
        var isEmailTaken = repository.existsByEmail(email);
        if (isEmailTaken) {
            log.error("Email already taken!");
            throw new AuthenticationFailureException(
                    AuthenticationFailedField.email, "Email already taken!");
        }

        // 2. save user
        var encodedPassword = passwordEncoder.encode(password);
        var applicationUser = ApplicationUser
                .builder()
                .email(email)
                .username(username)
                .password(encodedPassword)
                .build();
        repository.saveAndFlush(applicationUser);

        // 3. generate refresh token and save to session
        //    generate access token & response
        var userResponse = generateResponseAndToken(applicationUser, INITIAL_TOKEN_VERSION);
        return userResponse;
    }

    AuthorizationResponseDTO login(LoginCredentials loginCredentials) {
        // 1. check user password
        var applicationUser = repository
                .findByEmail(loginCredentials.email())
                .orElseThrow(() -> new AuthenticationFailureException(
                        AuthenticationFailedField.email,
                        "Email not found. Click here to create an account!"));

        boolean matches = passwordEncoder
                .matches(loginCredentials.password(),
                        applicationUser.getPassword());
        if (!matches) {
            log.error("Invalid password");
            throw new AuthenticationFailureException(
                    AuthenticationFailedField.password, "Incorrect password for this email.");
        }

        // 3. generate refresh token and save to session
        //    generate access token & response
        var tokenVersion = applicationUser.getRefreshTokenVersion();
        var userResponse = generateResponseAndToken(applicationUser, tokenVersion);

        // 4. send access token
        return userResponse;
    }

    AuthorizationResponseDTO refreshToken() {
        // 1. get both tokens
        var accessToken = request.getHeader(AUTHORIZATION);
        var refreshToken = (String) session.getAttribute(REFRESH_TOKEN);

        // 2. validate tokens and retrieve payload
        var userIdInAccessToken = jwtUtils.getUserInfoFromAccessToken(accessToken);
        var refreshTokenPayload = jwtUtils.getPayloadFromRefreshToken(refreshToken);
        var userIdInRefreshToken = refreshTokenPayload.userId();
        var tokenVersion = refreshTokenPayload.tokenVersion();

        // 3. check if token version is valid
        var applicationUser = repository
                .findById(userIdInAccessToken.userId())
                .orElseThrow(() -> new AuthenticationFailureException());
        var isTokenNotValid = tokenVersion != applicationUser.getRefreshTokenVersion() ||
                userIdInAccessToken.userId() != userIdInRefreshToken;
        if (isTokenNotValid) {
            log.error("Token version mismatch.");
            session.invalidate();
            throw new AuthenticationFailureException();
        }

        // 4. generate refresh token and save to session
        //    generate access token & response
        var userResponse = generateResponseAndToken(applicationUser, tokenVersion);
        return userResponse;
    }

    void logout() {
        session.invalidate();
        // TODO: invalidate all related tokens
    }

    void changePassword() {
        // TODO: increment tokenVersion by 1
    }

    private AuthorizationResponseDTO generateResponseAndToken(
            ApplicationUser applicationUser,
            Integer tokenVersion) {
        var userId = applicationUser.getId();
        var email = applicationUser.getEmail();
        var username = applicationUser.getUsername();

        // store refreshToken in session
        var refreshToken = jwtUtils.createRefreshToken(userId, tokenVersion);
        session.setAttribute(REFRESH_TOKEN, refreshToken);

        // send accessToken to client
        var accessToken = jwtUtils.createAccessToken(userId, username);

        // response dto
        return AuthorizationResponseDTO
                .builder()
                .id(userId)
                .email(email)
                .username(username)
                .accessToken(accessToken)
                .build();
    }
}
