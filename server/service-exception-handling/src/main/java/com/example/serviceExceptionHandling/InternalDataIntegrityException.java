package com.example.serviceExceptionHandling;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class InternalDataIntegrityException extends RuntimeException {

    public InternalDataIntegrityException(String message) {
        super(message);
    }

}
