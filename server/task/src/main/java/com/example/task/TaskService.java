package com.example.task;

import com.example.task.dto.UpdateTaskDTO;
import com.example.task.model.Event;
import com.example.task.model.PreviousTask;
import com.example.task.model.Task;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

  private final EntityManager entityManager;
  private final TaskRepository taskRepository;

  public List<Task> getAllTasks() {
    return taskRepository.findAll();
  }

  public Task createTask(Task task) {
    // Manage relationship
    setTaskWatcherForEvents(task);
    return taskRepository.save(task);
  }

  @Transactional
  public List<Task> updateTasks(UpdateTaskDTO updateTaskDTO) {
    var sourceTaskId = updateTaskDTO.sourceTaskId();
    var tasksForUpdate = updateTaskDTO.tasks();
    var sourceTaskPayload = tasksForUpdate
      .stream()
      .filter(task -> task.id() == sourceTaskId)
      .findAny();

    var sourceTask = entityManager.find(Task.class, sourceTaskId);
    sourceTask.getEvents();
    sourceTask.addEvents(sourceTaskPayload.get().events());

    var tasks = new ArrayList<Task>();
    tasksForUpdate.forEach(
      taskForUpdate -> {
        var task = Task
          .builder()
          .id(taskForUpdate.id())
          .title(taskForUpdate.title())
          .status(taskForUpdate.status())
          .dueDate(taskForUpdate.dueDate())
          .priority(taskForUpdate.priority())
          .description(taskForUpdate.description())
          .creatorId(taskForUpdate.creatorId())
          .creatorName(taskForUpdate.creatorName())
          .previousItem(taskForUpdate.previousItem())
          .events(taskForUpdate.events())
          .build();

        tasks.add(task);
      }
    );

    // Manage relationship
    System.out.println(tasks);
    tasks
      .stream()
      .map(
        task ->
          task.getId() == sourceTaskId
            ? setEventForParticipantInTask(task)
            : task
      )
      .collect(Collectors.toList());

    return taskRepository.saveAll(tasks);
  }

  private Task setTaskWatcherForEvents(Task task) {
    task.getWatchers().forEach(watcher -> watcher.setTask_watcher(task));
    return task;
  }

  private Task setEventForParticipantInTask(Task task) {
    task.getEvents().forEach(event -> setEventForParticipant(event));
    return task;
  }

  private Event setEventForParticipant(Event event) {
    event.getParticipants().forEach(participant -> participant.setEvent(event));
    return event;
  }
}
