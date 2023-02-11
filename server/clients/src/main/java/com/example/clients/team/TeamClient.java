package com.example.clients.team;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import static com.example.clients.UrlConstants.TEAM_API_VERSION;

@FeignClient(name = "team", url = "${clients.team.url}")
public interface TeamClient {

    @PostMapping(path = TEAM_API_VERSION + "/init_team")
    Integer initTeamInRegistration(
            @RequestBody CreateTeamDTO createTeamDTO,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken
    );
}
