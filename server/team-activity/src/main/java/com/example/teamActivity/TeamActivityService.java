package com.example.teamActivity;

import com.example.clients.teamActivity.CreateTeamActivityDTO;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.serviceSecurityConfig.AuthenticatedSecurityContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamActivityService {

    private final TeamActivityRepository repository;
    private final AuthenticatedSecurityContext authenticatedSecurityContext;

    public TeamActivity createTeamActivity(
            CreateTeamActivityDTO createTeamActivityDTO) {
        var userId = authenticatedSecurityContext.getCurrentUserId();
        var teamId = createTeamActivityDTO.teamId();
        var spaceId = createTeamActivityDTO.spaceId();

        var teamActivity = TeamActivity.builder()
                .userId(userId)
                .teamId(teamId)
                .spaceId(spaceId)
                .build();

        return repository.save(teamActivity);
    }

    public TeamActivity getTeamActivity(Integer teamId, Integer userId) {
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
        var folderIds = dto.folderIds();

        var userId = authenticatedSecurityContext.getCurrentUserId();

        if (userId == null && dto.userId() != null) {
            userId = dto.userId();
        }
        if (userId == null) return;

        var teamActivity = repository
                .findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> {
                    throw new InternalErrorException(
                            "User's teamActivity somehow disappeared");
                });

        // update spaceId
        var isToggleSpace = Objects.equals(
                teamActivity.getSpaceId(), spaceId);
        if (isToggleSpace) {
            teamActivity.setSpaceId(null);
        } else {
            teamActivity.setSpaceId(spaceId);
        }

        // update folderIds
        if (folderIds != null && !folderIds.isEmpty()) {
            folderIds.forEach(folderId -> {
                var isFolderIdExists = teamActivity.getFolderIds().contains(folderId);
                if (isFolderIdExists) {
                    teamActivity.getFolderIds().remove(folderId);
                } else {
                    teamActivity.getFolderIds().add(folderId);
                }
            });
        }

        // update listId
        teamActivity.setListId(listId);
    }
}
