package com.example.task;

import static com.example.clients.UrlConstants.*;

import com.example.task.model.Task;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

  @GetMapping
  String get() {
    taskService.doStuff();
    return "Got it";
  }

  @GetMapping("/all")
  ResponseEntity<List<Task>> getAllTasks() {
    var allTasks = taskService.getAllTasks();
    return ResponseEntity.ok(allTasks);
  }
}
