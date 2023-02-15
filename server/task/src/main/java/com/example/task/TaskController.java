package com.example.task;

import com.example.task.dto.*;
import com.example.task.model.Task;
import com.example.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

import static com.example.clients.UrlConstants.TASK_API_VERSION;

@RestController
@RequestMapping(TASK_API_VERSION)
@RequiredArgsConstructor
class TaskController {

    private final TaskService service;

    @GetMapping
    ResponseEntity<TaskListStatusCategoryDTO> getAllTasks(
            @RequestParam("listId") Integer listId,
            @RequestParam("defaultStatusCategoryId") Integer defaultStatusCategoryId) {
        var taskListStatusCategory = service.getAllTasks(
                listId, defaultStatusCategoryId);
        return ResponseEntity.ok(taskListStatusCategory);
    }

    @PostMapping
    ResponseEntity<Task> createTask(
            @RequestBody CreateTaskDTO createTaskDTO) {
        var task = service.createTask(createTaskDTO);
        return ResponseEntity.ok(task);
    }

    @PutMapping
    ResponseEntity<Boolean> updateTasksPosition(
            @RequestBody UpdateTasksPositionDTO updateTasksPositionDTO) {
        var updatedTasks = service.updateTasksPosition(
                updateTasksPositionDTO);
        return ResponseEntity.ok(updatedTasks);
    }

    @GetMapping("/{taskId}")
    void test(@PathVariable Integer taskId) {
        service.deleteTasksByListId(Set.of(taskId));
    }

    @DeleteMapping("/{taskId}")
    ResponseEntity<Boolean> deleteTask(@PathVariable Integer taskId) {
        var isTaskDeleted = service.deleteTask(taskId);
        return ResponseEntity.ok(isTaskDeleted);
    }

    @PutMapping("/update_title")
    ResponseEntity<Boolean> updateTaskTitle(
            @RequestBody UpdateTaskTitleDTO updateTaskTitleDTO) {
        var updated = service.updateTaskTitle(updateTaskTitleDTO);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/update_desc")
    ResponseEntity<Boolean> updateTasksDesc(
            @RequestBody UpdateTaskDescDTO updateTaskDescDTO) {
        var updated = service.updateTaskDesc(updateTaskDescDTO);
        return ResponseEntity.ok(updated);
    }
}
