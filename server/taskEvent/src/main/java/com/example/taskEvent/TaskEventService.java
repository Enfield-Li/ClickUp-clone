package com.example.taskEvent;

import com.example.taskEvent.model.TaskEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskEventService {

  private final TaskEventRepository taskEventRepository;

  public void insertEvent(TaskEvent taskEvent) {
    setTaskEventForParticipant(taskEvent);
    taskEventRepository.save(taskEvent);
  }

  private TaskEvent setTaskEventForParticipant(TaskEvent taskEvent) {
    taskEvent
      .getParticipants()
      .forEach(participant -> participant.setTaskEvent(taskEvent));

    return taskEvent;
  }
}
