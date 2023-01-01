package com.example.teamStatusColumn;

import static com.example.clients.UrlConstants.TEAM_STATUS_COLUMN_API_VERSION;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.teamStatusColumn.model.StatusColumn;
import com.example.teamStatusColumn.model.TeamStatusColumn;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TEAM_STATUS_COLUMN_API_VERSION)
class TeamStatusColumnController {

    private final TeamStatusColumnService statusColumnService;

    @GetMapping
    String test() {
        System.out.println("***called***");
        return "Got it";
    }

    @PostMapping
    ResponseEntity<Boolean> createStatusColumn(
            @RequestBody StatusColumn statusColumn) {
        var created = statusColumnService.createStatusColumn(statusColumn);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{teamId}")
    ResponseEntity<List<TeamStatusColumn>> getTeamStatusColumn(
            @RequestParam("teamId") Integer teamId) {
        var allTeamStatusColumns = statusColumnService
                .getTeamStatusColumn(teamId);
        return ResponseEntity.ok(allTeamStatusColumns);
    }

}
