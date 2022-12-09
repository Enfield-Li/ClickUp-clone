package com.example.clients.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationFailureException extends RuntimeException {

    private AuthenticationFailedField field;
    private String message;

    public AuthenticationFailureException() {
        super();
    }
}
