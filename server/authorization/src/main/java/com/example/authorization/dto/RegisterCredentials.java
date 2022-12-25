package com.example.authorization.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

public record RegisterCredentials(
        @Size(min = 4, max = 50, message = "Username should be at least 4 characters long!") 
        String username,

        @Size(min = 8, max = 50, message = "Password must be 8 characters or longer!") 
        String password,

        @Email 
        @Size(min = 4, max = 50, message = "Invalid email") 
        String email) {
}
