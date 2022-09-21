package com.example.auth.exception;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ErrorResponse {

  private final Integer status;
  private final String message;

  private List<ValidationError> errors = new ArrayList<>();

  @Data
  @RequiredArgsConstructor
  public class ValidationError {

    private final String field;
    private final String message;
  }

  public void addValidationError(String field, String message) {
    errors.add(new ValidationError(field, message));
  }
}
