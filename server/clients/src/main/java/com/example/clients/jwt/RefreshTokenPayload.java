package com.example.clients.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;

public record RefreshTokenPayload(
  Integer userId,
  Integer tokenVersion
) {}