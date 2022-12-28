package com.example.serviceExceptionHandling.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class InternalDataIntegrityException extends RuntimeException {

    public InternalDataIntegrityException(String message) {
        super(message);
    }
}
