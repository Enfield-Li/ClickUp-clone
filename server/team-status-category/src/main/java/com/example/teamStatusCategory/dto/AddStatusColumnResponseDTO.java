package com.example.teamStatusCategory.dto;

import java.util.HashMap;

public record AddStatusColumnResponseDTO(
        Integer statusCategoryId,
        Integer statusColumnId,
        HashMap<Integer, Integer> oldNewStatusPairs
) {
}
