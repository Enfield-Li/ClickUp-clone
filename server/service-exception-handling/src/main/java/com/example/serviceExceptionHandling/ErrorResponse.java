package com.example.serviceExceptionHandling;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private Integer status;
    private String message;

    private List<ValidationError> errors = new ArrayList<>();

    public void addValidationError(String field, String message) {
        errors.add(new ValidationError(field, message));
    }
}
