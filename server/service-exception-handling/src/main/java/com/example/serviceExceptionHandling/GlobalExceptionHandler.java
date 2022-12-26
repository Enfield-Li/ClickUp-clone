package com.example.serviceExceptionHandling;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.log4j.Log4j2;

@Log4j2
@ControllerAdvice
public class GlobalExceptionHandler {

    /* Catch all exception */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> catchAllExceptions(
            Exception exception) {
        log.error("\n **************** Uncaught Error ****************",
                exception);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage());
    }

    /* InvalidRequestBody */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> catchInvalidRequestBodyInputException(
            MethodArgumentNotValidException exception) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST,
                "Error occurred when validating fields, please check the errors list.",
                exception.getBindingResult().getFieldErrors());
    }

    /* InternalDataIntegrityException */
    @ExceptionHandler(InternalDataIntegrityException.class)
    public ResponseEntity<ErrorResponse> catchInternalDataIntegrityException(
            InternalDataIntegrityException exception) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage());
    }

    /* InvalidRequestException */
    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ErrorResponse> catchInvalidRequestException(
            InvalidRequestException exception) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST,
                exception.getMessage());
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

}
