package com.example.authorization;

import static com.example.authorization.Constants.*;
import static com.example.clients.UrlConstants.*;

import com.example.authorization.dto.AuthorizationResponseDTO;
import com.example.authorization.dto.LoginCredentials;
import com.example.authorization.dto.RegisterCredentials;
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
    ResponseEntity<AuthorizationResponseDTO> register(
            @Valid @RequestBody RegisterCredentials credentials) {
        var userResponse = authorizationService.register(credentials);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(LOGIN)
    ResponseEntity<AuthorizationResponseDTO> login(
            @Valid @RequestBody LoginCredentials credentials) {
        var userResponse = authorizationService.login(credentials);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(REFRESH_TOKEN)
    ResponseEntity<AuthorizationResponseDTO> refreshToken(
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
