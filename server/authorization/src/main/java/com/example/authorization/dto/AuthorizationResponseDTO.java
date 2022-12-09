package com.example.authorization.dto;

import java.util.Set;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorizationResponseDTO {

    private Integer id;
    private String email;
    private String username;
    private String accessToken;
    private Set<Integer> teams;
}
