package com.example.team.controller;

import static com.example.clients.UrlConstants.*;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateTeamDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
import com.example.team.service.TeamService;

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
    ResponseEntity<List<Team>> getAllTeams(@RequestBody List<Integer> teamIds) {
        var teams = teamService.getAllTeams(teamIds);
        return ResponseEntity.ok(teams);
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
