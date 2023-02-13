package com.example.clients.task;

import java.util.HashMap;

public record UpdateTaskStatusOnAddingColumnDTO(
        Integer listId,
        HashMap<Integer, Integer> oldNewStatusPairs
) {
}
