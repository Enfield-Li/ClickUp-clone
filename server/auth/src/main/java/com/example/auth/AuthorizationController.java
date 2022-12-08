package com.example.auth;

import static com.example.auth.Constants.*;
import static com.example.clients.UrlConstants.*;

import com.example.auth.dto.AuthorizationResponse;
import com.example.auth.dto.LoginCredentials;
import com.example.auth.dto.RegisterCredentials;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(AUTHORIZATION_API_VERSION)
class AuthorizationController {

    private final AuthorizationService authorizationService;

    @PostMapping(REGISTER)
    ResponseEntity<AuthorizationResponse> register(
            @Valid @RequestBody RegisterCredentials credentials) {
        var userResponse = authorizationService.register(credentials);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(LOGIN)
    ResponseEntity<AuthorizationResponse> login(
            @Valid @RequestBody LoginCredentials credentials) {
        var userResponse = authorizationService.login(credentials);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(REFRESH_TOKEN)
    ResponseEntity<AuthorizationResponse> refreshToken(
            HttpServletRequest request) {
        var userResponse = authorizationService.refreshToken();
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(LOGOUT)
    void logout() {
        authorizationService.logout();
    }

    @PostMapping(CHANGE_PASSWORD)
    void changePassword() {
        authorizationService.changePassword();
    }
}
