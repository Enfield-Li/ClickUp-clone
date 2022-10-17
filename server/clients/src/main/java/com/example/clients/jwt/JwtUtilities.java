package com.example.clients.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

public interface JwtUtilities {
    String createAccessToken(Integer userId);

    String createRefreshToken(Integer userId, Integer tokenVersion);

    Jws<Claims> validateAccessToken(String jwsToken)
        throws InvalidTokenException;

    RefreshTokenPayload getPayloadFromRefreshToken(String bearerToken)
        throws InvalidTokenException;

    Integer getUserIdFromAccessToken(String bearerToken)
        throws InvalidTokenException;
}
