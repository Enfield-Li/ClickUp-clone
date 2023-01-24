package com.example.serviceSecurityConfig;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.clients.jwt.UserCredentials;

@Service
public class AuthenticatedSecurityContext {

    public UserCredentials getCurrentUserInfo() {
        return (UserCredentials) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
    }

    public Integer getCurrentUserId() {
        return getCurrentUserInfo().userId();
    }
}
