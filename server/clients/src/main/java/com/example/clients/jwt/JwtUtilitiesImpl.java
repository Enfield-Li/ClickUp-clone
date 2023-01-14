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
public class JwtUtilitiesImpl implements JwtUtilities {

    private Key key;

    @Value("${jjwt.secret}")
    private String secret;

    private final String HEADER_PREFIX = "Bearer ";
    private final String TOKEN_VERSION = "TOKEN_VERSION";
    private final Long accessTokenExpirationTime = 300 * 60 * 1000L; // 300 min in millisecond
    private final Long refreshTokenExpirationTime = 60 * 60 * 24 * 7 * 1000L; // one week in millisecond

    @PostConstruct
    public void init() {
        // https://github.com/jwtk/jjwt#signing-key
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public String createAccessToken(Integer userId, String username) {
        return Jwts
                .builder()
                .claim("username", username)
                .setSubject(Integer.toString(userId))
                .setExpiration(setExpirationTime(accessTokenExpirationTime))
                .setIssuedAt(new Date())
                .signWith(key)
                .compact();
    }

    @Override
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

    @Override
    public Jws<Claims> validateAccessToken(String jwsToken) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(resolveAccessToken(jwsToken));
        } catch (Exception e) {
            log.error("AccessToken validation error: " + e);
            throw new AuthenticationFailureException();
        }
    }

    // Includes parsing and validate token
    @Override
    public RefreshTokenPayload getPayloadFromRefreshToken(String bearerToken) {
        var claims = validateTokenAndGetClaims(bearerToken);

        var userId = Integer.parseInt(claims.getSubject());
        var refreshToken = claims.get(TOKEN_VERSION, Integer.class);

        return new RefreshTokenPayload(userId, refreshToken);
    }

    // Includes parsing and validate token
    @Override
    public UserCredentials getUserInfoFromAccessToken(String bearerToken) {
        var userId = Integer.parseInt(
                validateTokenAndGetClaims(resolveAccessToken(bearerToken))
                        .getSubject());

        var username = (String) validateTokenAndGetClaims(
                resolveAccessToken(bearerToken))
                        .get("username");

        return new UserCredentials(userId, username);
    }

    private Claims validateTokenAndGetClaims(String jwsToken) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwsToken)
                    .getBody();
        } catch (Exception e) {
            log.error("Token validation error: " + e);
            throw new AuthenticationFailureException();
        }
    }

    private String resolveAccessToken(String bearerToken) {
        if (StringUtils.hasText(bearerToken) &&
                bearerToken.startsWith(HEADER_PREFIX)) {
            return bearerToken.substring(7);
        }

        return null;
    }

    private Date setExpirationTime(Long time) {
        var date = new Date();
        return new Date(date.getTime() + time);
    }
}
