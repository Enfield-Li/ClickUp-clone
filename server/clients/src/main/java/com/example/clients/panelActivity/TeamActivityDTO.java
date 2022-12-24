package com.example.clients.panelActivity;

import java.util.List;

import javax.validation.constraints.NotNull;

public record TeamActivityDTO(
        Integer id,
        @NotNull Integer teamId,
        Integer listId,
        Integer spaceId,
        List<Integer> folderIds) {
}
