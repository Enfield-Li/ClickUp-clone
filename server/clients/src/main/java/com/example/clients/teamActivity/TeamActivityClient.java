package com.example.clients.teamActivity;

import static com.example.clients.UrlConstants.TEAM_ACTIVITY_API_VERSION;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "teamActivity", url = "${clients.teamActivity.url}")
public interface TeamActivityClient {

    @GetMapping(path = TEAM_ACTIVITY_API_VERSION)
    TeamActivityDTO getTeamActivity();

    @PostMapping(path = TEAM_ACTIVITY_API_VERSION)
    TeamActivityDTO createTeamActivity(
            @RequestBody CreateTeamActivityDTO updateDefaultTeamInCreationDTO);

}
