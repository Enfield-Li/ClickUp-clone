package com.example.authorization.exception;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ValidationError {

    private final String field;
    private final String message;
}
