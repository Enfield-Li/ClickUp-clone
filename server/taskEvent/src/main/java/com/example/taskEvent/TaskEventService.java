package com.example.taskEvent;

import com.example.clients.taskEvent.eventDTO.TaskEventDTO;
import com.example.taskEvent.model.Participant;
import com.example.taskEvent.model.TaskEvent;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskEventService {

  private final TaskEventRepository taskEventRepository;

  public void addTaskEvent(TaskEventDTO taskEventDTO) {
    var taskEvent = TaskEvent
      .builder()
      .id(taskEventDTO.id())
      .updateTo(taskEventDTO.updateTo())
      .updateFrom(taskEventDTO.updateFrom())
      .updatedAt(taskEventDTO.updatedAt())
      .updateAction(taskEventDTO.updateAction())
      .commentContent(taskEventDTO.commentContent())
      .taskId(taskEventDTO.taskId())
      .initiatorId(taskEventDTO.initiatorId())
      .initiatorName(taskEventDTO.initiatorName())
      .eventType(taskEventDTO.eventType())
      .participants(
        Set.of(
          Participant
            .builder()
            .id(taskEventDTO.participants().get(0).id())
            .userId(taskEventDTO.participants().get(0).userId())
            .username(taskEventDTO.participants().get(0).username())
            .build()
        )
      )
      // .parentComment(taskEventDTO.parentComment())
      // .childrenComments(taskEventDTO.childrenComments())
      .build();

    setTaskEventForParticipant(taskEvent);
    taskEventRepository.save(taskEvent);
  }

  private TaskEvent setTaskEventForParticipant(TaskEvent taskEvent) {
    taskEvent
      .getParticipants()
      .forEach(participant -> participant.setTaskEvent(taskEvent));

    return taskEvent;
  }

  public List<TaskEvent> getAllTaskEvents(Integer taskId) {
    return taskEventRepository.findAllByTaskId(taskId);
  }
}
