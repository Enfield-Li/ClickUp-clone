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

  public void doStuff() {
    var task = new Task();
    task.setTitle("task3");

    var previousItem = new PreviousTask();
    previousItem.setStatusId(1);
    task.setPreviousItem(previousItem);

    var saved = taskRepository.save(task);

    System.out.println(saved);
  }

  public List<Task> getAllTasks() {
    return taskRepository.findAll();
  }

  public Task createTask(Task task) {
    return taskRepository.save(task);
  }
}
