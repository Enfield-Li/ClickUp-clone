package com.example.authorization.dto;

import com.example.clients.authorization.InitTeamUIState;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegistrationResponseDTO {

    private Integer id;
    private String email;
    private String color;
    private String username;
    private String accessToken;
    private Integer defaultTeamId;
    private Integer joinedTeamCount;
    private InitTeamUIState initTeamUIState;
}
