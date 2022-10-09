package com.example.task.dto;

import java.util.List;
import com.example.task.model.EventType;
import com.example.task.model.UpdateAction;

public record EventDTO(
    Integer initiatorId,
    String initiatorName,
    EventType eventType,
    UpdateAction updateAction,
    Integer updateFrom,
    Integer updateTo,
    List<ParticipantDTO> participants
) {}
