package com.example.teamActivity;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.jwt.UserCredentials;
import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamActivityService {

    private final TeamActivityRepository repository;

    public UserCredentials getCurrentUserInfo() {
        return (UserCredentials) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
    }

    private Integer getCurrentUserId() {
        return getCurrentUserInfo().userId();
    }

    public TeamActivity createTeamActivity(
            CreateTeamActivityDTO createTeamActivityDTO) {
        var userId = getCurrentUserId();
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
        var userId = getCurrentUserId();
        return repository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> {
                    log.error("User's teamActivity somehow disappeared");
                    throw new InternalErrorException(
                            "User's teamActivity somehow disappeared");
                });
    }

    @Transactional
    public void updateTeamActivity(UpdateTeamActivityDTO dto) {
        var teamId = dto.teamId();
        var listId = dto.listId();
        var spaceId = dto.spaceId();
        var folderId = dto.folderId();

        // create space
        if (spaceId != null && listId != null) {
            repository.updateOpenedSpaceAndList(teamId, spaceId, listId);
            return;
        }

        if (folderId != null) {
            updateOpenedFolder(teamId, folderId);
        }

        if (listId != null) {
            repository.updateOpenedSpace(teamId, listId);
        }
    }

    private void updateOpenedFolder(Integer teamId, Integer folderId) {
        var userId = getCurrentUserId();

        var teamActivity = repository
                .findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> {
                    log.error("User's teamActivity somehow disappeared");
                    throw new InternalErrorException(
                            "User's teamActivity somehow disappeared");
                });

        var isFolderIdExists = teamActivity
                .getFolderIds().contains(folderId);
        if (isFolderIdExists) {
            teamActivity.getFolderIds().remove(folderId);
        } else {
            teamActivity.getFolderIds().add(folderId);
        }
    }

}
