package com.example.task;

import static com.example.clients.UrlConstants.*;
import static com.example.task.Constants.*;

import com.example.task.dto.UpdateTaskDTO;
import com.example.task.model.Task;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TASK_API_VERSION)
@RequiredArgsConstructor
class TaskController {

  private final TaskService taskService;
  private final EntityManager entityManager;
  private final TaskRepository taskRepository;

  @GetMapping(ALL_TASKS)
  ResponseEntity<List<Task>> getAllTasks() {
    var allTasks = taskService.getAllTasks();
    return ResponseEntity.ok(allTasks);
  }

  @PostMapping
  ResponseEntity<Task> createTask(@RequestBody Task task) {
    var allTasks = taskService.createTask(task);
    return ResponseEntity.ok(allTasks);
  }

  @PutMapping
  ResponseEntity<List<Task>> updateTasks(
    @RequestBody UpdateTaskDTO updateTaskDTO
  ) {
    var updatedTasks = taskService.updateTasks(updateTaskDTO);
    return ResponseEntity.ok(updatedTasks);
  }

  @GetMapping
  void test() {
    var sourceTask = entityManager.find(Task.class, 1);
    System.out.println(sourceTask.getWatchers());
  }
}
