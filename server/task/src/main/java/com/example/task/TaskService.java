package com.example.task;

import static com.example.amqp.exchange.TaskEventExchange.internalExchange;
import static com.example.amqp.exchange.TaskEventExchange.taskEventRoutingKey;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.jwt.UserInfo;
import com.example.clients.taskEvent.Field;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.dto.UpdateTaskDTO;
import com.example.task.dto.UpdateTaskDescDTO;
import com.example.task.dto.UpdateTaskTitleDTO;
import com.example.task.dto.UpdateTasksPositionDTO;
import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.Task;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    private UserInfo getCurrentUserInfo() {
        return (UserInfo) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(CreateTaskDTO createTaskDTO) {
        var userInfo = getCurrentUserInfo();
        var userId = userInfo.userId();
        var username = userInfo.username();

        var task = Task.convertFromCreateTaskDto(
            createTaskDTO,
            userId,
            username
        );

        return taskRepository.save(task);
    }

    @Transactional
    public Boolean updateTasksPosition(
        UpdateTasksPositionDTO updateTasksPositionDTO
    ) {
        var userInfo = getCurrentUserInfo();
        var userId = userInfo.userId();
        var username = userInfo.username();

        // When updating sourceTask, a new event will be created for it
        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();
        var taskDtoList = updateTasksPositionDTO.taskDtoList();

        // Find sourceTask
        var sourceTask = taskDtoList
            .stream()
            .filter(task -> task.id() == sourceTaskId)
            .findFirst();

        // publish task update event
        var taskEvents = sourceTask.get().taskEvents();
        if (!taskEvents.isEmpty()) {
            var updateEventDTO = taskEvents.get(0);
            updateEventDTO.setUserId(userId);
            updateEventDTO.setUsername(username);

            rabbitMQMessageProducer.publish(
                internalExchange,
                taskEventRoutingKey,
                updateEventDTO
            );
        }

        // DTO to entity
        var tasks = new ArrayList<Task>();
        taskDtoList.forEach(taskDTO -> {
            var task = Task.convertFromUpdateTaskDto(taskDTO);
            tasks.add(task);
        });

        taskRepository.saveAll(tasks);
        return true;
    }

    public Boolean deleteTask(Integer taskId, List<Task> tasksForUpdate) {
        try {
            // Update other tasks position
            taskRepository.saveAll(Task.setTaskForWatcher(tasksForUpdate));
            // Delete the task in question
            taskRepository.deleteById(taskId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public Boolean updateTaskTitle(UpdateTaskTitleDTO updateTaskTitleDTO) {
        var userInfo = getCurrentUserInfo();
        var userId = userInfo.userId();
        var username = userInfo.username();

        var taskId = updateTaskTitleDTO.taskId();
        var newTitle = updateTaskTitleDTO.newTitle();
        var oldTitle = taskRepository.getTaskTitle(taskId);

        var updateEventDTO = UpdateEventDTO
            .builder()
            .userId(userId)
            .username(username)
            .field(Field.title)
            .beforeUpdate(oldTitle)
            .afterUpdate(newTitle)
            .taskId(taskId)
            .build();

        // publish task update title event
        rabbitMQMessageProducer.publish(
            internalExchange,
            taskEventRoutingKey,
            updateEventDTO
        );

        return (
            taskRepository.updateTaskTitle(newTitle, taskId) > 0 &&
            taskRepository.renewTaskUpdatedAt(LocalDateTime.now(), taskId) > 0
        );
    }

    @Transactional
    public Boolean updateTaskDesc(UpdateTaskDescDTO updateTaskDescDTO) {
        var taskId = updateTaskDescDTO.taskId();
        var newDesc = updateTaskDescDTO.newDesc();

        return (
            taskRepository.updateTaskDesc(newDesc, taskId) > 0 &&
            taskRepository.renewTaskUpdatedAt(LocalDateTime.now(), taskId) > 0
        );
    }
}
