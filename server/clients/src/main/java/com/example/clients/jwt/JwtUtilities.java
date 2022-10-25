package com.example.clients.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

public interface JwtUtilities {
    String createAccessToken(Integer userId, String username);

    String createRefreshToken(Integer userId, Integer tokenVersion);

    Jws<Claims> validateAccessToken(String jwsToken)
        throws InvalidTokenException;

    RefreshTokenPayload getPayloadFromRefreshToken(String bearerToken)
        throws InvalidTokenException;

    UserInfo getUserInfoFromAccessToken(String bearerToken)
        throws InvalidTokenException;
}
