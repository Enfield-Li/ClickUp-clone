package com.example.teamStatusCategory.dto;

import javax.validation.constraints.NotNull;
import java.util.HashMap;

public record AddStatusColumnResponseDTO(
        @NotNull Integer statusCategoryId,
        @NotNull Integer statusColumnId,
        HashMap<Integer, Integer> oldNewStatusPairs
) {
}
