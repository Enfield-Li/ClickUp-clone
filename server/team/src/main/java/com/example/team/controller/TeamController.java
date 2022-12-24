package com.example.team.controller;

import static com.example.clients.UrlConstants.TEAM_API_VERSION;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateTeamDTO;
import com.example.team.dto.TeamAndPanelActivityDTO;
import com.example.team.service.TeamService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TEAM_API_VERSION)
class TeamController {

    private final TeamService teamService;

    @GetMapping("/test")
    String test() {
        System.out.println("***called***");
        teamService.test();
        return "Got it";
    }

    @GetMapping
    ResponseEntity<TeamAndPanelActivityDTO> getAllTeams(
            @RequestBody List<Integer> teamIds) {
        var teamAndPanelActivityDTO = teamService.getAllTeams(teamIds);
        return ResponseEntity.ok(teamAndPanelActivityDTO);
    }

    @PostMapping
    ResponseEntity<Boolean> createTeam(
            @RequestBody CreateTeamDTO createTeamDTO) {
        var created = teamService.createTeam(createTeamDTO);
        return ResponseEntity.ok(created);
    }

    // @PostMapping("/init_team")
    // ResponseEntity<Boolean> initTeam(@RequestBody UserInfo userInfo) {

    //     var created = teamService.initTeam(userInfo);
    //     return ResponseEntity.ok(true);
    // }
}
