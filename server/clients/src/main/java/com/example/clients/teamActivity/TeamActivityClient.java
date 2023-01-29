package com.example.clients.teamActivity;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import static com.example.clients.UrlConstants.TEAM_ACTIVITY_API_VERSION;

@FeignClient(name = "teamActivity", url = "${clients.teamActivity.url}")
public interface TeamActivityClient {

    @GetMapping(path = TEAM_ACTIVITY_API_VERSION)
    TeamActivityDTO getTeamActivity(
            @RequestParam("teamId") Integer teamId,
            @RequestParam("userId") Integer userId
    );

    @PostMapping(path = TEAM_ACTIVITY_API_VERSION)
    TeamActivityDTO createTeamActivity(
            @RequestBody CreateTeamActivityDTO createTeamActivityDTO);
}
