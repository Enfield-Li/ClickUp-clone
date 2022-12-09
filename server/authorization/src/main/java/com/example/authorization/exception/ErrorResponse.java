package com.example.authorization.exception;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ErrorResponse {

    private final Integer status;
    private final String message;

    private List<ValidationError> errors = new ArrayList<>();

    public void addValidationError(String field, String message) {
        errors.add(new ValidationError(field, message));
    }
}
