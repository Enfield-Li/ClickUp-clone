package com.example.clients.teamActivity;

import javax.validation.constraints.NotNull;

public record UpdateTeamActivityDTO(
        @NotNull Integer teamId,
        Integer spaceId,
        Integer folderId,
        Integer listId,
        Integer userId
) {
}
