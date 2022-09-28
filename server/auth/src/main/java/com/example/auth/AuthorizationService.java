package com.example.auth;

import com.example.clients.jwt.JwtUtilities;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

  private final JwtUtilities jwtUtils;
  private final HttpSession session;
  private final PasswordEncoder passwordEncoder;
  private final ApplicationUserRepository repository;
}
