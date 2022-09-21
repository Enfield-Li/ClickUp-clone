package com.example.clients.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

public interface JwtUtilities {
  String createAccessToken(Integer userId);

  String createRefreshToken(Integer userId, Integer tokenVersion);

  Jws<Claims> validateAccessToken(String jwsToken)
    throws InvalidCredentialsException;

  RefreshTokenPayload getPayloadFromRefreshToken(String bearerToken)
    throws InvalidCredentialsException;

  Integer getUserIdFromAccessToken(String bearerToken)
    throws InvalidCredentialsException;
}
