package com.example.team.controller;

import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.CreateTeamResponseDTO;
import com.example.team.dto.InitTeamListDTO;
import com.example.team.service.TeamService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.clients.UrlConstants.TEAM_API_VERSION;

@Log4j2
@RestController
@Tag(name = "Team")
@RequiredArgsConstructor
@RequestMapping(TEAM_API_VERSION)
class TeamController {

    private final TeamService service;

    @GetMapping("/{teamId}")
    ResponseEntity<InitTeamListDTO> getAllTeams(
            @PathVariable("teamId") Integer teamId) {
        var teamResponseDTO = service.getAllTeams(teamId);
        return ResponseEntity.ok(teamResponseDTO);
    }

    @PostMapping
    ResponseEntity<CreateTeamResponseDTO> createTeam(
            @RequestBody CreateTeamDTO createTeamDTO) {
        var createTeamResponseDTO = service.createTeam(createTeamDTO);
        return ResponseEntity.ok(createTeamResponseDTO);
    }

    // @PostMapping("/init_team")
    // ResponseEntity<Boolean> initTeam(@RequestBody UserInfo userInfo) {

    //     var created = teamService.initTeam(userInfo);
    //     return ResponseEntity.ok(true);
    // }
}
