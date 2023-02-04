package com.example.clients.teamActivity;

import javax.validation.constraints.NotNull;
import java.util.Set;

public record UpdateTeamActivityDTO(
        @NotNull Integer teamId,
        Integer spaceId,
        Set<Integer> folderIds,
        Integer listId,
        Integer userId
) {
}
