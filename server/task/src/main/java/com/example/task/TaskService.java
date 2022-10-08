package com.example.task;

import com.example.task.model.PreviousTask;
import com.example.task.model.Task;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;

  public List<Task> getAllTasks() {
    return taskRepository.findAll();
  }

  public Task createTask(Task task) {
    task.getWatchers().forEach(watcher -> watcher.setTask_watcher(task));
    System.out.println("task: " + task.toString());
    return taskRepository.save(task);
  }

  // https://stackoverflow.com/questions/17137903/jpa-updating-objects-in-onetomany-relations
  // https://stackoverflow.com/questions/32980044/jpa-update-list-of-one-to-many-relationship
  public List<Task> updateTasks(List<Task> tasks) {
    return taskRepository.saveAll(tasks);
  }
}
