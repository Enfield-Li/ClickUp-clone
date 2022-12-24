package com.example.userTeam;

import static com.example.clients.UrlConstants.USER_TEAM_API_VERSION;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.userTeam.dto.CreateNewUserTeamDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(USER_TEAM_API_VERSION)
class UserTeamController {

    private final UserTeamService userTeamService;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @PostMapping
    ResponseEntity<?> joinNewTeam(CreateNewUserTeamDTO createNewUserTeamDTO) {
        userTeamService.joinNewTeam(createNewUserTeamDTO);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/{userId}")
    ResponseEntity<List<Integer>> getUserTeam(@RequestParam("userId") Integer userId) {
        var teamIds = userTeamService.getUserJoinedTeamIds(userId);
        return ResponseEntity.ok(teamIds);
    }

}
