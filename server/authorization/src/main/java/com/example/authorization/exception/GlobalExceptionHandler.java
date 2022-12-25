package com.example.authorization.exception;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.clients.jwt.AuthenticationFailureException;

import lombok.extern.log4j.Log4j2;

/*
 * https://www.baeldung.com/exception-handling-for-rest-with-spring
 * https://reflectoring.io/spring-boot-exception-handling/#controlleradvice
 * https://stackoverflow.com/questions/33663801/how-do-i-customize-default-error-message-from-spring-valid-validation
 */
@Log4j2
@ControllerAdvice
public class GlobalExceptionHandler {

    /* Catch all exception */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> catchAllExceptions(
            Exception exception) {
        log.error(
                "\n **************** Uncaught Error ****************",
                exception);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage());
    }

    /* Catch InvalidRequestBody */
    @ExceptionHandler(value = { MethodArgumentNotValidException.class })
    protected ResponseEntity<ErrorResponse> catchInvalidRequestBodyInputException(
            MethodArgumentNotValidException exception) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Error occurred when validating fields, please check the errors list.",
                exception.getBindingResult().getFieldErrors());
    }

    @ExceptionHandler(value = AuthenticationFailureException.class)
    ResponseEntity<ErrorResponse> catchLoginFailure(AuthenticationFailureException exception) {
        log.error("InvalidateCredentialsException");

        if (exception.getField() == null) {
            return buildErrorResponse(
                    HttpStatus.UNAUTHORIZED,
                    "Account login time out, please login again.");
        }

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Error occurred when validating fields, please check the errors list.",
                exception.getField() == null ? null : getValidationError(exception));
    }

    /*
     * Build ErrorResponse
     */
    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus httpStatus,
            String message) {
        ErrorResponse errorResponse = new ErrorResponse(
                httpStatus.value(),
                message);

        return ResponseEntity.status(httpStatus).body(errorResponse);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus httpStatus,
            String message,
            List<FieldError> errors) {
        ErrorResponse errorResponse = new ErrorResponse(
                httpStatus.value(),
                message);

        errors.forEach(
                fieldError -> errorResponse.addValidationError(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()));

        return ResponseEntity.status(httpStatus).body(errorResponse);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus httpStatus,
            String message,
            ValidationError error) {
        ErrorResponse errorResponse = new ErrorResponse(
                httpStatus.value(),
                message);

        if (error != null) {
            errorResponse.addValidationError(
                    error.getField(),
                    error.getMessage());
        }

        return ResponseEntity.status(httpStatus).body(errorResponse);
    }

    private ValidationError getValidationError(
            AuthenticationFailureException exception) {
        return new ValidationError(exception.getField().toString(),
                exception.getMessage());
    }
}
