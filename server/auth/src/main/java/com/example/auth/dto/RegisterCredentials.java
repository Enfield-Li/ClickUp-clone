package com.example.auth.dto;

import javax.validation.constraints.Size;

public record RegisterCredentials(
        @Size(min = 4, 
            max = 50, 
            message = "Username should be at least 4 characters long!") 
        String username,

        @Size(min = 8, 
            max = 50, 
            message = "Password must be 8 characters or longer!") 
        String password, 
        
        @Size(min = 4, 
            max = 50, 
            message = "Invalid email") 
        String email) {
}
