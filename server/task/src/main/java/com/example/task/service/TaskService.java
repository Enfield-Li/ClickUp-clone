package com.example.task.service;

import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.task.InitTasksInRegistrationDTO;
import com.example.clients.task.UpdateTaskOnCreateNewColumnDTO;
import com.example.clients.taskEvent.Field;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.task.dto.*;
import com.example.task.model.Task;
import com.example.task.model.UserInfo;
import com.example.task.model.taskPosition.Priority;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;
import com.example.task.repository.TaskMapper;
import com.example.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskMapper taskMapper;
    private final EntityManager entityManager;
    private final TaskRepository repository;
    private final UserInfoService userInfoService;
    private final StatusCategoryClient statusCategoryClient;
    // private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public TaskListStatusCategoryDTO getAllTasks(
            Integer listId, Integer defaultStatusCategoryId) {
        var statusCategoryDTO = statusCategoryClient
                .getStatusCategoryForList(defaultStatusCategoryId);

        var taskList = repository.findByListId(listId);

        return new TaskListStatusCategoryDTO(statusCategoryDTO, taskList);
    }

    @Transactional
    public Task createTask(CreateTaskDTO createTaskDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();
        var task = Task.convertFromCreateTaskDto(createTaskDTO);
        userInfo.addTask(task);
        task.addWatcher(userInfo);
        task.addAssignee(userInfo);

        return repository.save(task);
    }

    @Transactional
    public Boolean updateTasksPosition(
            UpdateTasksPositionDTO updateTasksPositionDTO) {
        // var userInfo = getCurrentUserInfo();
        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();
        var taskDtoList = updateTasksPositionDTO.taskDtoList();

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

            if (priority != null) {
                taskMapper.updateTaskPosition(
                        priority.getId(), priorityTableName, priority);
            }

            if (status == null && priority == null) {
                taskMapper.updateExpectedDueDate(
                        taskDTO.taskId(), expectedDueDate);
            }
        });

        // Find sourceTask
        var sourceTask = taskDtoList.stream()
                .filter(task -> Objects.equals(task.taskId(), sourceTaskId))
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

        return true;
    }

    @Transactional
    public Boolean deleteTask(Integer taskId) {
        var task = entityManager.getReference(Task.class, taskId);
        var creatorId = task.getCreatorId();

        task.getWatchers().forEach(task::removeWatcher);
        task.getAssignees().forEach(task::removeAssignee);

        var creator = entityManager.getReference(UserInfo.class, creatorId);
        creator.removeTask(task);

        entityManager.remove(task);
        return true;
    }

    @Transactional
    public Boolean updateTaskTitle(UpdateTaskTitleDTO updateTaskTitleDTO) {
        var userInfo = userInfoService.getCurrentUserInfo();
        var userId = userInfo.getUserId();
        var username = userInfo.getUsername();

        var taskId = updateTaskTitleDTO.taskId();
        var newTitle = updateTaskTitleDTO.newTitle();
        var oldTitle = repository.getTaskTitle(taskId);

        var updateEventDTO = UpdateEventDTO
                .builder()
                .userId(userId)
                .username(username)
                .field(Field.title)
                .beforeUpdate(oldTitle)
                .afterUpdate(newTitle)
                .taskId(taskId)
                .build();

        var updateCount = repository.updateTitle(
                taskId,
                newTitle,
                LocalDateTime.now());

        // publish task update title event
        // rabbitMQMessageProducer.publish(
        //         internalExchange,
        //         taskEventRoutingKey,
        //         updateEventDTO);

        return updateCount > 0;
    }

    @Transactional
    public Boolean updateTaskDesc(UpdateTaskDescDTO updateTaskDescDTO) {
        var taskId = updateTaskDescDTO.taskId();
        var newDesc = updateTaskDescDTO.newDesc();

        var updateCount = repository.updateDesc(
                taskId,
                newDesc,
                LocalDateTime.now());

        return updateCount > 0;
    }

    @Transactional
    public void updateTaskStatusPositionOnCreateNewColumn(
            UpdateTaskOnCreateNewColumnDTO eventDTO) {
        var listId = eventDTO.listId();
        var oldNewStatusPairs = eventDTO.oldNewStatusPairs();

        var taskList = repository.findByListId(listId);

        taskList.forEach(task -> {
            var originalColumnId = task.getStatus().getColumnId();
            var newColumnId = oldNewStatusPairs.get(originalColumnId);
            task.getStatus().setColumnId(newColumnId);
        });
    }

    @Transactional
    public Boolean deleteTasks(Set<Integer> ids) {
        repository.deleteAllByListIdIn(ids);
        return true;
    }

    public Boolean initTasksInRegistration(
            InitTasksInRegistrationDTO initTasksInRegistrationDTO) {
        var listId = initTasksInRegistrationDTO.listCategoryId();
        var statusCategoryDTO = initTasksInRegistrationDTO.statusCategoryDTO();

        var userInfo = userInfoService.getCurrentUserInfo();
        var desc = "Yep, there are definitely improvements needed for this modal component";
        var statusColumns = statusCategoryDTO.statusColumns();

        var status1 = StatusPosition.builder()
                .orderIndex(1).name(statusColumns.get(1).title())
                .columnId(statusColumns.get(1).id()).build();

        var status2 = StatusPosition.builder()
                .orderIndex(1).name(statusColumns.get(0).title())
                .columnId(statusColumns.get(0).id()).build();

        var status3 = StatusPosition.builder()
                .orderIndex(2).name(statusColumns.get(0).title())
                .columnId(statusColumns.get(0).id()).build();

        var status4 = StatusPosition.builder()
                .orderIndex(1).name(statusColumns.get(2).title())
                .columnId(statusColumns.get(2).id()).build();

        var priority1 = PriorityPosition.builder()
                .columnId(1).orderIndex(1)
                .name(Priority.NO_PRIORITY).build();

        var priority2 = PriorityPosition.builder()
                .columnId(2).orderIndex(1)
                .name(Priority.HIGH).build();

        var priority3 = PriorityPosition.builder()
                .columnId(1).orderIndex(2)
                .name(Priority.NO_PRIORITY).build();

        var task1 = Task.builder()
                .listId(listId)
                .status(status1)
                .priority(priority1)
                .description(desc)
                .title("Look! You made some progress")
                .build();

        var task2 = Task.builder()
                .listId(listId)
                .status(status2)
                .priority(priority2)
                .title("Try change priority 👇")
                .build();

        var task3 = Task.builder()
                .listId(listId)
                .status(status3)
                .priority(priority3)
                .title("Try change due date 👇")
                .expectedDueDate(LocalDateTime.now())
                .build();

        var task4 = Task.builder()
                .listId(listId)
                .status(status4)
                .description("Done! This task is hidden from 'group by' priority/due date")
                .priority(priority3)
                .title("Finished task")
                .build();

        var taskList = List.of(task1, task2, task3, task4);
        taskList.forEach(task -> {
            task.setCreator(userInfo);
            task.addAssignee(userInfo);
            task.addWatcher(userInfo);
        });

        repository.saveAll(taskList);
        return true;
    }
}
