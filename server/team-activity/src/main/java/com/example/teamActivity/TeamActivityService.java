package com.example.teamActivity;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.clients.jwt.UserCredentials;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamActivityService {

    private final TeamActivityRepository repository;

    public UserCredentials getCurrentUserInfo() {
        return (UserCredentials) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public TeamActivity createTeamActivity(
            CreateTeamActivityDTO createTeamActivityDTO) {
        var userId = getCurrentUserInfo().userId();
        var teamId = createTeamActivityDTO.teamId();
        var spaceId = createTeamActivityDTO.spaceId();

        var teamActivity = TeamActivity.builder()
                .userId(userId)
                .teamId(teamId)
                .spaceId(spaceId)
                .build();

        return repository.save(teamActivity);
    }

    public TeamActivity getTeamActivity(Integer teamId) {
        var userId = getCurrentUserInfo().userId();

        return repository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new InvalidRequestException(
                        "Invalid request, because either"
                                + " 1. User's workspace activity has yet been initialized, or"
                                + " 2. User record no longer exists."));
    }
}
