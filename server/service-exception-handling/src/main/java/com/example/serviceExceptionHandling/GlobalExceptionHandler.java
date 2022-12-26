package com.example.serviceExceptionHandling;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import feign.FeignException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@ControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    ObjectMapper objectMapper;

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

    /* FeignException */
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> catchFeignClientException(
            FeignException exception) throws JsonMappingException, JsonProcessingException {
        var responseBody = retrieveErrorResponse(exception.responseBody().get());
        return buildErrorResponse(HttpStatus.valueOf(exception.status()),
                responseBody.getMessage());
    }

    /*
     * Build ErrorResponse
     */
    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus httpStatus,
            String message) {
        var errorResponse = new ErrorResponse(
                httpStatus.value(),
                message,
                null);

        return ResponseEntity.status(httpStatus).body(errorResponse);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus httpStatus,
            String message,
            List<FieldError> errors) {
        var errorResponse = new ErrorResponse(
                httpStatus.value(),
                message,
                null);

        errors.forEach(
                fieldError -> errorResponse.addValidationError(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()));

        return ResponseEntity.status(httpStatus).body(errorResponse);
    }

    private ErrorResponse retrieveErrorResponse(ByteBuffer ByteBuffer)
            throws JsonMappingException, JsonProcessingException {
        var responseBodyJSON = StandardCharsets.UTF_8.decode(ByteBuffer).toString();
        return objectMapper.readValue(responseBodyJSON, ErrorResponse.class);
    }
}
