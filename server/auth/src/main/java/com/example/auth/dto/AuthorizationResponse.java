package com.example.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorizationResponse {

    private Integer id;
    private String username;
    private String accessToken;
}
