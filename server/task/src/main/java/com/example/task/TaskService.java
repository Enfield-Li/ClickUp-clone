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
    return taskRepository.save(task);
  }

  public List<Task> updateTasks(List<Task> tasks) {
    return taskRepository.saveAll(tasks);
  }
}
