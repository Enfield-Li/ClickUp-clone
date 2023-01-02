package com.example.task;

import static com.example.clients.UrlConstants.*;
import static com.example.task.config.Constants.*;

import com.example.task.dto.TaskPositionDTO;
import com.example.task.dto.UpdateTaskDescDTO;
import com.example.task.dto.UpdateTaskTitleDTO;
import com.example.task.dto.UpdateTasksPositionDTO;
import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.Task;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.validation.Valid;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(TASK_API_VERSION)
@RequiredArgsConstructor
class TaskController {

    private final TaskService taskService;
    private final EntityManager entityManager;
    private final TaskRepository taskRepository;

    @GetMapping
    void test() {
        var sourceTask = entityManager.find(Task.class, 1);
        System.out.println(sourceTask.getWatchers());
    }

    @GetMapping("/{listId}")
    ResponseEntity<List<Task>> getAllTasks(
            @PathVariable("listId") Integer listId) {
        var allTasks = taskService.getAllTasks(listId);
        return ResponseEntity.ok(allTasks);
    }

    @PostMapping
    ResponseEntity<Task> createTask(
            @RequestBody CreateTaskDTO createTaskDTO) {
        var task = taskService.createTask(createTaskDTO);
        return ResponseEntity.ok(task);
    }

    @PutMapping
    ResponseEntity<Boolean> updateTasksPosition(
            @RequestBody UpdateTasksPositionDTO updateTasksPositionDTO) {
        var updatedTasks = taskService.updateTasksPosition(
                updateTasksPositionDTO);
        return ResponseEntity.ok(updatedTasks);
    }

    @PutMapping("/{taskId}")
    ResponseEntity<Boolean> deleteTask(
            @PathVariable Integer taskId,
            @RequestBody List<Task> tasksForUpdate) {
        var isTaskDeleted = taskService.deleteTask(taskId, tasksForUpdate);
        return ResponseEntity.ok(isTaskDeleted);
    }

    @PutMapping("/update_title")
    ResponseEntity<Boolean> updateTaskTitle(
            @RequestBody UpdateTaskTitleDTO updateTaskTitleDTO) {
        var updated = taskService.updateTaskTitle(updateTaskTitleDTO);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/update_desc")
    ResponseEntity<Boolean> updateTasksDesc(
            @RequestBody UpdateTaskDescDTO updateTaskDescDTO) {
        var updated = taskService.updateTaskDesc(updateTaskDescDTO);
        return ResponseEntity.ok(updated);
    }
}
