package com.example.teamActivity;

import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.clients.UrlConstants.TEAM_ACTIVITY_API_VERSION;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TEAM_ACTIVITY_API_VERSION)
class TeamActivityController {

    private final TeamActivityService teamActivityService;

    @GetMapping
    ResponseEntity<TeamActivity> getTeamActivity(
            @RequestParam("teamId") Integer teamId,
            @RequestParam("userId") Integer userId) {
        var TeamActivity = teamActivityService.getTeamActivity(teamId, userId);
        return ResponseEntity.ok(TeamActivity);
    }

    @PostMapping
    ResponseEntity<TeamActivity> createTeamActivity(
            @RequestBody CreateTeamActivityDTO dto) {
        var teamActivity = teamActivityService
                .createTeamActivity(dto);
        return ResponseEntity.ok(teamActivity);
    }

    @PutMapping
    void updateTeamActivity(
            @RequestBody UpdateTeamActivityDTO dto) {
        teamActivityService.updateTeamActivity(dto);
    }
}
