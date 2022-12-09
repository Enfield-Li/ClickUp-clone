package com.example.authorization;

import static com.example.clients.UrlConstants.*;

import com.example.authorization.dto.AuthorizationResponse;
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

    AuthorizationResponse register(RegisterCredentials registerCredentials) {
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
                .password(encodedPassword)
                .email(registerCredentials.email())
                .username(registerCredentials.username())
                .build();

        repository.saveAndFlush(applicationUser);
        var userId = applicationUser.getId();

        // 3. generate refresh token and save to session
        //    generate access token & response
        var userResponse = generateToken(userId, username, INITIAL_TOKEN_VERSION);

        return userResponse;
    }

    AuthorizationResponse login(LoginCredentials loginCredentials) {
        // 1. check user password
        var applicationUser = repository
                .findByEmail(loginCredentials.email())
                .orElseThrow(() -> new AuthenticationFailureException(
                        AuthenticationFailedField.email,
                        "Email not found. Click here to create an account!"));

        boolean matches = passwordEncoder.matches(
                loginCredentials.password(),
                applicationUser.getPassword());

        if (!matches) {
            log.error("Invalid password");
            throw new AuthenticationFailureException(
                    AuthenticationFailedField.password, "Incorrect password for this email.");
        }

        var userId = applicationUser.getId();
        var username = applicationUser.getUsername();
        var tokenVersion = applicationUser.getRefreshTokenVersion();

        // 3. generate refresh token and save to session
        //    generate access token & response
        var userResponse = generateToken(userId, username, tokenVersion);

        // 4. send access token
        return userResponse;
    }

    AuthorizationResponse refreshToken() {
        // 1. get both tokens
        var accessToken = request.getHeader(AUTHORIZATION);
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
                .orElseThrow(() -> new AuthenticationFailureException());
        var username = applicationUser.getUsername();

        if (tokenVersion != applicationUser.getRefreshTokenVersion() ||
                userIdInAccessToken.userId() != userIdInRefreshToken) {
            log.error("Token version mismatch.");
            session.invalidate();
            throw new AuthenticationFailureException();
        }

        // 4. generate refresh token and save to session
        //    generate access token & response
        var userResponse = generateToken(userIdInAccessToken.userId(), username, tokenVersion);

        return userResponse;
    }

    void logout() {
        session.invalidate();
        // TODO: invalidate all related tokens
    }

    void changePassword() {
        // TODO: increment tokenVersion by 1
    }

    private AuthorizationResponse generateToken(
            Integer userId,
            String username,
            Integer tokenVersion) {
        var refreshToken = jwtUtils.createRefreshToken(userId, tokenVersion);
        session.setAttribute(REFRESH_TOKEN, refreshToken);

        var accessToken = jwtUtils.createAccessToken(userId, username);

        return AuthorizationResponse
                .builder()
                .accessToken(accessToken)
                .username(username)
                .id(userId)
                .build();
    }
}
