package com.example.clients.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

public interface JwtUtilities {
    String createAccessToken(Integer userId, String username);

    String createRefreshToken(Integer userId, Integer tokenVersion);

    Jws<Claims> validateAccessToken(String jwsToken)
            throws AuthenticationFailureException;

    RefreshTokenPayload getPayloadFromRefreshToken(String bearerToken)
            throws AuthenticationFailureException;

    UserCredentials getUserInfoFromAccessToken(String bearerToken)
            throws AuthenticationFailureException;
}
