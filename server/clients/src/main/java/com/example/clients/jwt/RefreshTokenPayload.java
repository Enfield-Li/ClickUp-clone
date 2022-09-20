package com.example.clients.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenPayload {

  Integer userId;
  Integer tokenVersion;
}
