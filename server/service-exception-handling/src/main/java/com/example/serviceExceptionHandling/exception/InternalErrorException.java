package com.example.serviceExceptionHandling.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class InternalErrorException extends RuntimeException {

    public InternalErrorException(String message) {
        super(message);
    }
}
