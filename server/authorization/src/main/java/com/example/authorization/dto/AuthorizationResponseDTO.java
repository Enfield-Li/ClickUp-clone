package com.example.authorization.dto;

import java.util.Set;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorizationResponseDTO {

    private Integer id;
    private String email;
    private String color;
    private String username;
    private String accessToken;
    private Integer defaultTeamId;
    private Integer joinedTeamCount;
}
