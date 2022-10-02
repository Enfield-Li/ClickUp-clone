package com.example.auth;

import static com.example.clients.UrlConstants.*;

import com.example.auth.dto.AuthorizationResponse;
import com.example.auth.dto.Credentials;
import com.example.auth.exception.LoginFailedException;
import com.example.auth.exception.UserAlreadyExistsException;
import com.example.clients.jwt.InvalidTokenException;
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

  public AuthorizationResponse register(Credentials credentials) {
    var username = credentials.getUsername();
    var password = credentials.getPassword();

    // 1. check if user exist
    var exist = repository.existsByUsername(username);

    // 1.5 user exists
    if (exist) {
      log.error("User already exists.");
      throw new UserAlreadyExistsException();
    }

    // 2. save user
    credentials.setPassword(passwordEncoder.encode(password));
    var applicationUser = ApplicationUser
      .builder()
      .username(credentials.getUsername())
      .password(credentials.getPassword())
      .build();

    repository.saveAndFlush(applicationUser);
    var userId = applicationUser.getId();

    // 3. generate refresh token and save to session
    //    generate access token & response
    var userResponse = createSaveTokensToSessionAndResponse(
      userId,
      username,
      INITIAL_TOKEN_VERSION
    );

    return userResponse;
  }

  AuthorizationResponse login(Credentials credentials) {
    // 1. check user password
    var applicationUser = repository
      .findByUsername(credentials.getUsername())
      .orElseThrow(() -> new LoginFailedException());

    boolean matches = passwordEncoder.matches(
      credentials.getPassword(),
      applicationUser.getPassword()
    );

    // 1.5 wrong password
    if (!matches) {
      log.error("Invalid password");
      throw new LoginFailedException();
    }

    var userId = applicationUser.getId();
    var username = applicationUser.getUsername();
    var tokenVersion = applicationUser.getRefreshTokenVersion();

    // 3. generate refresh token and save to session
    //    generate access token & response
    var userResponse = createSaveTokensToSessionAndResponse(
      userId,
      username,
      tokenVersion
    );

    // 4. send access token
    return userResponse;
  }

  AuthorizationResponse refreshToken() {
    // 1. get both tokens
    var accessToken = request.getHeader(AUTHORIZATION);
    var refreshToken = (String) session.getAttribute(REFRESH_TOKEN);

    // 2. validate tokens and retrieve payload
    var userIdInAccessToken = jwtUtils.getUserIdFromAccessToken(accessToken);

    var refreshTokenPayload = jwtUtils.getPayloadFromRefreshToken(refreshToken);
    var userIdInRefreshToken = refreshTokenPayload.getUserId();
    var tokenVersion = refreshTokenPayload.getTokenVersion();

    // 3. check if token version is valid
    var applicationUser = repository
      .findById(userIdInAccessToken)
      .orElseThrow(() -> new InvalidTokenException());
    var username = applicationUser.getUsername();

    if (
      tokenVersion != applicationUser.getRefreshTokenVersion() ||
      userIdInAccessToken != userIdInRefreshToken
    ) {
      log.error("Token version mismatch.");
      session.invalidate();
      throw new InvalidTokenException();
    }

    // 4. generate refresh token and save to session
    //    generate access token & response
    var userResponse = createSaveTokensToSessionAndResponse(
      userIdInAccessToken,
      username,
      tokenVersion
    );

    return userResponse;
  }

  public void logout() {
    session.invalidate();
    // TODO: invalidate all related tokens
  }

  public void changePassword() {
    // TODO: increment tokenVersion by 1
  }

  private AuthorizationResponse createSaveTokensToSessionAndResponse(
    Integer userId,
    String username,
    Integer tokenVersion
  ) {
    var refreshToken = jwtUtils.createRefreshToken(userId, tokenVersion);
    session.setAttribute(REFRESH_TOKEN, refreshToken);

    var accessToken = jwtUtils.createAccessToken(userId);

    return AuthorizationResponse
      .builder()
      .accessToken(accessToken)
      .username(username)
      .id(userId)
      .build();
  }
}
