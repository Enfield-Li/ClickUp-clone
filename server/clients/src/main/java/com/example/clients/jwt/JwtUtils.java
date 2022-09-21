package com.example.clients.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import javax.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Log4j2
@Component
public class JwtUtils {

  private Key key;

  @Value("${jjwt.secret}")
  private String secret;

  private final String HEADER_PREFIX = "Bearer ";
  private final String TOKEN_VERSION = "TOKEN_VERSION";
  private final Long accessTokenExpirationTime = 30 * 60 * 1000L; // 30 min in millisecond
  private final Long refreshTokenExpirationTime = 60 * 60 * 24 * 7 * 1000L; // one week in millisecond

  @PostConstruct
  public void init() {
    // https://github.com/jwtk/jjwt#signing-key
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
  }

  public String createAccessToken(Integer userId) {
    return Jwts
      .builder()
      .setSubject(Integer.toString(userId))
      .setExpiration(setExpirationTime(accessTokenExpirationTime))
      .setIssuedAt(new Date())
      .signWith(key)
      .compact();
  }

  public String createRefreshToken(Integer userId, Integer tokenVersion) {
    return Jwts
      .builder()
      .setSubject(Integer.toString(userId))
      .claim(TOKEN_VERSION, tokenVersion)
      .setExpiration(setExpirationTime(refreshTokenExpirationTime))
      .setIssuedAt(new Date())
      .signWith(key)
      .compact();
  }

  public Jws<Claims> validateAccessToken(String jwsToken) {
    try {
      return Jwts
        .parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(resolveAccessToken(jwsToken));
    } catch (Exception e) {
      log.error("AccessToken validation error: " + e);
      throw new InvalidateCredentialsException();
    }
  }

  public Claims validateTokenAndGetClaims(String jwsToken) {
    try {
      return Jwts
        .parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(jwsToken)
        .getBody();
    } catch (Exception e) {
      log.error("Token validation error: " + e);
      throw new InvalidateCredentialsException();
    }
  }

  // Includes parsing and validate token
  public RefreshTokenPayload getRefreshTokenPayload(String bearerToken) {
    var claims = validateTokenAndGetClaims(bearerToken);

    var userId = Integer.parseInt(claims.getSubject());
    var refreshToken = claims.get(TOKEN_VERSION, Integer.class);

    return new RefreshTokenPayload(userId, refreshToken);
  }

  // Includes parsing and validate token
  public Integer getAccessTokenUserId(String bearerToken) {
    return Integer.parseInt(
      validateTokenAndGetClaims(resolveAccessToken(bearerToken)).getSubject()
    );
  }

  public String resolveAccessToken(String bearerToken) {
    if (
      StringUtils.hasText(bearerToken) && bearerToken.startsWith(HEADER_PREFIX)
    ) {
      return bearerToken.substring(7);
    }

    return null;
  }

  private Date setExpirationTime(Long time) {
    var date = new Date();
    return new Date(date.getTime() + time);
  }
}
