package com.example.auth;

import static com.example.auth.Constants.*;
import static com.example.clients.UrlConstants.*;

import com.example.auth.dto.AuthorizationResponse;
import com.example.auth.dto.Credentials;
import com.example.auth.exception.UserAlreadyExistsException;
import com.example.clients.jwt.InvalidCredentialsException;
import com.example.clients.jwt.JwtUtilities;
import com.fasterxml.jackson.core.JsonProcessingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(USER_API)
class AuthorizationController {

  private final JwtUtilities jwtUtils;
  private final HttpSession session;
  private final PasswordEncoder passwordEncoder;
  private final ApplicationUserRepository repository;

  private final Integer INITIAL_TOKEN_VERSION = 0;
  private final String REFRESH_TOKEN = "refresh_token";

  @PostMapping(REGISTER)
  ResponseEntity<AuthorizationResponse> register(
    @Valid @RequestBody Credentials credentials
  )
    throws JsonProcessingException {
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

    // 4. send access token
    return ResponseEntity.ok(userResponse);
  }

  @PostMapping(LOGIN)
  ResponseEntity<AuthorizationResponse> login(
    @Valid @RequestBody Credentials credentials
  )
    throws JsonProcessingException {
    // 1. check user password
    var applicationUser = repository
      .findByUsername(credentials.getUsername())
      .orElseThrow(() -> new InvalidCredentialsException());

    boolean matches = passwordEncoder.matches(
      credentials.getPassword(),
      applicationUser.getPassword()
    );

    // 1.5 wrong password
    if (!matches) {
      log.error("Invalid password");
      throw new InvalidCredentialsException();
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
    return ResponseEntity.ok(userResponse);
  }

  @PostMapping(REFRESH_TOKEN)
  ResponseEntity<AuthorizationResponse> refreshToken(
    HttpServletRequest request
  ) {
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
      .orElseThrow(() -> new InvalidCredentialsException());
    var username = applicationUser.getUsername();

    if (
      tokenVersion != applicationUser.getRefreshTokenVersion() ||
      userIdInAccessToken != userIdInRefreshToken
    ) {
      log.error("Token version mismatch.");
      session.invalidate();
      throw new InvalidCredentialsException();
    }

    // 4. generate refresh token and save to session
    //    generate access token & response
    var userResponse = createSaveTokensToSessionAndResponse(
      userIdInAccessToken,
      username,
      tokenVersion
    );

    return ResponseEntity.ok(userResponse);
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

  @PostMapping(LOGOUT)
  void logout(HttpSession session) {
    session.invalidate();
    // TODO: invalidate all related tokens
  }

  private void changePassword() {
    // TODO: increment tokenVersion by 1
  }
}
