package com.example.teamActivity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.serviceSecurityConfig.AuthenticatedUserContext;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamActivityService {

    private final TeamActivityRepository repository;
    private final AuthenticatedUserContext authenticatedUserContext;

    public TeamActivity createTeamActivity(
            CreateTeamActivityDTO createTeamActivityDTO) {
        var userId = authenticatedUserContext.getCurrentUserId();
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
        var userId = authenticatedUserContext.getCurrentUserId();
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

        var userId = authenticatedUserContext.getCurrentUserId();

        var teamActivity = repository
                .findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> {
                    log.error("User's teamActivity somehow disappeared");
                    throw new InternalErrorException(
                            "User's teamActivity somehow disappeared");
                });

        if (folderId != null) {
            if (teamActivity.getSpaceId() == spaceId) {
                teamActivity.setSpaceId(null);
            } else {
                teamActivity.setSpaceId(spaceId);
            }
        }

        if (folderId != null) {
            var isFolderIdExists = teamActivity.getFolderIds().contains(folderId);
            if (isFolderIdExists) {
                teamActivity.getFolderIds().remove(folderId);
            } else {
                teamActivity.getFolderIds().add(folderId);
            }
        }

        if (listId != null) {
            teamActivity.setListId(listId);
        }
    }
}
