package com.example.teamActivity;

import static com.example.clients.UrlConstants.TEAM_ACTIVITY_API_VERSION;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.clients.teamActivity.UpdateDefaultTeamInCreationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TEAM_ACTIVITY_API_VERSION)
class TeamActivityController {

    private final TeamActivityService teamActivityService;

    @GetMapping
    ResponseEntity<TeamActivity> getTeamActivity() {
        var TeamActivity = teamActivityService.getTeamActivity();
        return ResponseEntity.ok(TeamActivity);
    }

    @PostMapping
    ResponseEntity<Boolean> updateDefaultTeamInCreation(
            @RequestBody UpdateDefaultTeamInCreationDTO createTeamActivityDTO) {
        var created = teamActivityService.updateDefaultTeamInCreation(createTeamActivityDTO);
        return ResponseEntity.ok(created);
    }

}
