package com.example.authorization;

import com.example.authorization.dto.AuthorizationResponseDTO;
import com.example.authorization.dto.LoginUserDTO;
import com.example.authorization.dto.RegisterUserDTO;
import com.example.authorization.dto.RegistrationResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import static com.example.authorization.Constants.*;
import static com.example.clients.UrlConstants.AUTHORIZATION_API_VERSION;

@RestController
@RequiredArgsConstructor
@RequestMapping(AUTHORIZATION_API_VERSION)
class AuthorizationController {

    private final AuthorizationService service;

    @PostMapping(REGISTER)
    ResponseEntity<RegistrationResponseDTO> register(
            @Valid @RequestBody RegisterUserDTO credentials) {
        var userResponse = service.register(credentials);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(LOGIN)
    ResponseEntity<AuthorizationResponseDTO> login(
            @Valid @RequestBody LoginUserDTO credentials) {
        var userResponse = service.login(credentials);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(REFRESH_TOKEN)
    ResponseEntity<AuthorizationResponseDTO> refreshToken(
            HttpServletRequest request) {
        var userResponse = service.refreshToken();
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{teamId}")
    ResponseEntity<Boolean> updateDefaultTeamId(
            @PathVariable("teamId") Integer teamId) {
        var updateResult = service.updateUserDefaultTeamId(teamId);
        return ResponseEntity.ok(updateResult);
    }

    @PostMapping(LOGOUT)
    Boolean logout() {
        service.logout();
        return true;
    }

    @PostMapping(CHANGE_PASSWORD)
    void changePassword() {
        service.changePassword();
    }
}
