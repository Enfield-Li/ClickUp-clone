package com.example.team.controller;

import com.example.clients.authorization.InitTeamUIState;
import com.example.clients.team.CreateTeamDTO;
import com.example.team.model.Team;
import com.example.team.service.TeamService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

import static com.example.clients.UrlConstants.TEAM_API_VERSION;

@Log4j2
@RestController
@Tag(name = "Team")
@RequiredArgsConstructor
@RequestMapping(TEAM_API_VERSION)
class TeamController {

    private final TeamService service;

    @GetMapping("/{teamId}")
    ResponseEntity<Set<Team>> getAllTeams(
            @PathVariable("teamId") Integer teamId) {
        var teams = service.getAllTeams(teamId);
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    ResponseEntity<Team> createTeam(
            @RequestBody CreateTeamDTO createTeamDTO) {
        var createdTeam = service.createTeam(createTeamDTO);
        return ResponseEntity.ok(createdTeam);
    }

    @PostMapping("/init_team")
    ResponseEntity<InitTeamUIState> initTeamInRegistration(
            @RequestBody CreateTeamDTO createTeamDTO) {
        var createdTeam = service.initTeamInRegistration(createTeamDTO);
        return ResponseEntity.ok(createdTeam);
    }

    @PutMapping("{spaceId}")
    public ResponseEntity<Boolean> updateTeam(
            @PathVariable Integer teamId,
            @RequestParam Map<String, String> params) {
        var updated = service.updateTeam(teamId, params);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{teamId}")
    ResponseEntity<Boolean> deleteTeam(
            @PathVariable("teamId") Integer teamId) {
        var deleted = service.deleteTeam(teamId);
        return ResponseEntity.ok(deleted);
    }
}
