package com.example.authorization.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

public record LoginUserDTO(
        @Email @Size(min = 4, max = 50, message = "Invalid email.") String email,

        @Size(min = 8, max = 50, message = "Invalid password.") String password) {
}
