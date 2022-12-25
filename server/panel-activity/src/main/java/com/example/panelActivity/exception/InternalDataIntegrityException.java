package com.example.panelActivity.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class InternalDataIntegrityException extends RuntimeException {

    public InternalDataIntegrityException(String message) {
        super(message);
    }

}
