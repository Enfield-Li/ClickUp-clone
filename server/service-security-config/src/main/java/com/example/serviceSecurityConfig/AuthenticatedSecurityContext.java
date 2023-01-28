package com.example.serviceSecurityConfig;

import com.example.clients.jwt.UserCredentials;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticatedSecurityContext {

    public UserCredentials getCurrentUserInfo() {
        return (UserCredentials) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
    }

    public Integer getCurrentUserId() {
        try {
            return getCurrentUserInfo().userId();
        } catch (Exception e) {
            return null;
        }
    }
}
