package com.example.auth.dto;

import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class Credentials {

    @Size(min = 3, message = "Username must be longer than 3 characters.")
    private String username;

    @Size(min = 7, message = "Password must be longer than 7 characters.")
    private String password;
}
