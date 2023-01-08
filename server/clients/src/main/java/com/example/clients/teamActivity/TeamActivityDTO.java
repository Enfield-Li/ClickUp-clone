package com.example.clients.teamActivity;

import java.util.List;

import javax.validation.constraints.NotNull;

public record TeamActivityDTO(
        Integer id,
        Integer listId,
        Integer spaceId,
        @NotNull Integer teamId,
        @NotNull Integer userId,
        List<Integer> folderIds) {
}
