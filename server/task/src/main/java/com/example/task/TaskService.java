package com.example.task;

import static com.example.amqp.exchange.TaskEventExchange.internalExchange;
import static com.example.amqp.exchange.TaskEventExchange.taskEventRoutingKey;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.jwt.UserInfo;
import com.example.clients.taskEvent.Field;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.dto.TaskPositionDTO;
import com.example.task.dto.UpdateTaskDescDTO;
import com.example.task.dto.UpdateTaskTitleDTO;
import com.example.task.dto.UpdateTasksPositionDTO;
import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.Participant;
import com.example.task.model.Task;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public UserInfo getCurrentUserInfo() {
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

        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();
        var taskDtoList = updateTasksPositionDTO.taskDtoList();

        // Find sourceTask
        var sourceTask = taskDtoList
            .stream()
            .filter(task -> task.taskId() == sourceTaskId)
            .findFirst();

        // Task drop into a different column
        // publish task update event
        var taskEvents = sourceTask.get().taskEvents();
        if (!CollectionUtils.isEmpty(taskEvents)) {
            var updateEventDTO = taskEvents.get(0);
            updateEventDTO.setUserId(userId);
            updateEventDTO.setUsername(username);

            rabbitMQMessageProducer.publish(
                internalExchange,
                taskEventRoutingKey,
                updateEventDTO
            );
        }

        var statusTableName = "status_position";
        var dueDateTableName = "due_date_position";
        var priorityTableName = "priority_position";

        // update position
        taskDtoList.forEach(taskDTO -> {
            if (taskDTO.status() != null) {
                taskMapper.updateTaskPosition(
                    taskDTO.status().getId(),
                    statusTableName,
                    taskDTO.status().getOrderIndex()
                );
            } else if (taskDTO.dueDate() != null) {
                var isSourceTaskExpectedDueDateUpdated =
                    taskDTO.expectedDueDate() != null &&
                    taskDTO.taskId() == sourceTaskId;
                if (isSourceTaskExpectedDueDateUpdated) {
                    taskMapper.updateTaskExpectedDueDate(
                        taskDTO.expectedDueDate()
                    );
                }
                taskMapper.updateTaskPosition(
                    taskDTO.dueDate().getId(),
                    dueDateTableName,
                    taskDTO.dueDate().getOrderIndex()
                );
            } else if (taskDTO.priority() != null) {
                taskMapper.updateTaskPosition(
                    taskDTO.priority().getId(),
                    priorityTableName,
                    taskDTO.priority().getOrderIndex()
                );
            }
        });

        return true;
    }

    public Boolean deleteTask(Integer taskId, List<Task> tasksForUpdate) {
        // Update other tasks position
        taskRepository.saveAll(Task.setTaskForWatcher(tasksForUpdate));
        // Delete the task in question
        taskRepository.deleteById(taskId);
        return true;
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

        var rowsAffected = taskRepository.updateTaskTitle(
            taskId,
            newTitle,
            LocalDateTime.now()
        );

        return rowsAffected > 0;
    }

    @Transactional
    public Boolean updateTaskDesc(UpdateTaskDescDTO updateTaskDescDTO) {
        var taskId = updateTaskDescDTO.taskId();
        var newDesc = updateTaskDescDTO.newDesc();

        var rowsAffected = taskRepository.updateTaskDesc(
            taskId,
            newDesc,
            LocalDateTime.now()
        );

        return rowsAffected > 0;
    }
}
