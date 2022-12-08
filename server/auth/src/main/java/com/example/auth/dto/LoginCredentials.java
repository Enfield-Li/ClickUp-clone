package com.example.auth.dto;

import javax.validation.constraints.Size;

public record LoginCredentials(
        @Size(min = 4, 
            max = 50, 
            message = "Invalid email.") 
        String email,
        
        @Size(min = 8, 
            max = 50, 
            message = "Invalid password.") 
        String password) {
}
