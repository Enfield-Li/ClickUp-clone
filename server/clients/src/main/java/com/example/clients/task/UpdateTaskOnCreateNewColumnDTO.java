package com.example.clients.task;

import java.util.HashMap;

public record UpdateTaskOnCreateNewColumnDTO(
        Integer listId,
        HashMap<Integer, Integer> oldNewStatusPairs
) {
}
