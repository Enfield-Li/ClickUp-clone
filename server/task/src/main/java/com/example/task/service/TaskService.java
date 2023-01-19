package com.example.task.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.statusCategory.StatusCategoryClient;

// import static com.example.amqp.exchange.TaskEventExchange.internalExchange;
// import static com.example.amqp.exchange.TaskEventExchange.taskEventRoutingKey;

// import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.taskEvent.Field;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.dto.CreateTaskDTO;
import com.example.task.dto.TaskListStatusCategoryDTO;
import com.example.task.dto.UpdateTaskDescDTO;
import com.example.task.dto.UpdateTaskTitleDTO;
import com.example.task.dto.UpdateTasksPositionDTO;
import com.example.task.model.Task;
import com.example.task.repository.TaskMapper;
import com.example.task.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;
    private final UserInfoService userInfoService;
    private final StatusCategoryClient statusCategoryClient;
    // private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public TaskListStatusCategoryDTO getAllTasks(
            Integer listId, Integer defaultStatusCategoryId) {
        var statusCategoryDTO = statusCategoryClient
                .getStatusCategoryForList(defaultStatusCategoryId);

        var taskList = taskRepository.findByListId(listId);

        return new TaskListStatusCategoryDTO(statusCategoryDTO, taskList);
    }

    @Transactional
    public Task createTask(CreateTaskDTO createTaskDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();
        var task = Task.convertFromCreateTaskDto(
                createTaskDTO,
                userInfo);

        return taskRepository.save(task);
    }

    @Transactional
    public Boolean updateTasksPosition(
            UpdateTasksPositionDTO updateTasksPositionDTO) {
        // var userInfo = getCurrentUserInfo();
        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();
        var taskDtoList = updateTasksPositionDTO.taskDtoList();

        // Find sourceTask
        var sourceTask = taskDtoList
                .stream()
                .filter(task -> task.taskId() == sourceTaskId)
                .findFirst();

        // Task drop into a different column
        // publish task update event
        // var taskEvents = sourceTask.get().taskEvents();
        // if (taskEvents != null) {
        //     taskEvents.setUserId(userId);
        //     taskEvents.setUsername(username);

        //     rabbitMQMessageProducer.publish(
        //             internalExchange,
        //             taskEventRoutingKey,
        //             taskEvents);
        // }

        var statusTableName = "status_position";
        var priorityTableName = "priority_position";

        // update position
        taskDtoList.forEach(taskDTO -> {
            var status = taskDTO.status();
            var priority = taskDTO.priority();
            var expectedDueDate = taskDTO.expectedDueDate();

            if (status != null) {
                taskMapper.updateTaskPosition(
                        status.getId(), statusTableName, status);
            }

            if (expectedDueDate != null) {
                taskMapper.updateExpectedDueDate(
                        taskDTO.taskId(), taskDTO.expectedDueDate());
            }

            if (priority != null) {
                taskMapper.updateTaskPosition(
                        priority.getId(), priorityTableName, priority);
            }
        });

        return true;
    }

    public Boolean deleteTask(Integer taskId, List<Task> tasksForUpdate) {
        taskRepository.deleteById(taskId);
        return true;
    }

    @Transactional
    public Boolean updateTaskTitle(UpdateTaskTitleDTO updateTaskTitleDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();
        var userId = userInfo.getUserId();
        var username = userInfo.getUsername();

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
        // rabbitMQMessageProducer.publish(
        //         internalExchange,
        //         taskEventRoutingKey,
        //         updateEventDTO);

        var updateCount = taskRepository.updateTitle(
                taskId,
                newTitle,
                LocalDateTime.now());

        return updateCount > 0;
    }

    @Transactional
    public Boolean updateTaskDesc(UpdateTaskDescDTO updateTaskDescDTO) {
        var taskId = updateTaskDescDTO.taskId();
        var newDesc = updateTaskDescDTO.newDesc();

        var updateCount = taskRepository.updateDesc(
                taskId,
                newDesc,
                LocalDateTime.now());

        return updateCount > 0;
    }
}
