package com.example.task.dto;

import java.util.Date;
import java.util.Set;

import javax.validation.constraints.NotNull;

import com.example.task.model.Participant;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.model.PreviousTask;
import com.example.task.model.PreviousTaskBeforeFinish;

public record UpdateTaskDTO(
   @NotNull Integer id,
   @NotNull String title,
   
   Integer status,
   Integer priority,
   String description,
   Date expectedDueDate,
   PreviousTask previousTask,
   Set<Participant> watchers,
   Set<Participant> assignees,
   Set<UpdateEventDTO> taskEvents,
   PreviousTaskBeforeFinish previousTaskBeforeFinish
) {}
