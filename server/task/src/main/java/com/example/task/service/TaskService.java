package com.example.task.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.task.InitTasksInRegistrationDTO;
import com.example.clients.task.UpdateTaskStatusOnAddingColumnDTO;
import com.example.clients.taskEvent.Field;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.amqp.ExchangeKey.taskEventRoutingKey;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskMapper taskMapper;
    private final EntityManager entityManager;
    private final TaskRepository repository;
    private final UserInfoService userInfoService;
    private final StatusCategoryClient statusCategoryClient;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

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
        var taskDtoList = updateTasksPositionDTO.taskDtoList();
        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();

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

        if (sourceTask.isEmpty()) {
            throw new InvalidRequestException("Missing source task");
        }

        // Task drop into a different column publish task update event
        var taskEvents = sourceTask.get().taskEvents();
        var userInfo = userInfoService.getCurrentUserInfo();
        if (taskEvents != null) {
            taskEvents.setUserId(userInfo.getUserId());
            taskEvents.setUsername(userInfo.getUsername());

            rabbitMQMessageProducer.publish(
                    internalExchange,
                    taskEventRoutingKey,
                    taskEvents);
        }

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

        var updateEventDTO = UpdateEventDTO.builder()
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
        rabbitMQMessageProducer.publish(
                internalExchange,
                taskEventRoutingKey,
                updateEventDTO);

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
    public void updateTaskStatusOnAddingNewColumn(
            UpdateTaskStatusOnAddingColumnDTO eventDTO) {
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
    public void deleteTasksByListId(Set<Integer> listIds) {
        List<Integer> taskIds = new ArrayList<>();
        var taskIdDTOs = repository.findByListIdIn(listIds);
        taskIdDTOs.forEach(taskIdDTO -> taskIds.add(taskIdDTO.id()));
        taskIds.forEach(this::deleteTask);
    }

    @Transactional
    public Boolean deleteTask(Integer taskId) {
        var task = entityManager.getReference(Task.class, taskId);
        var creatorId = task.getCreatorId();

        task.removeAllWatchers();
        task.removeAllAssignees();

        var creator = entityManager.getReference(UserInfo.class, creatorId);
        creator.removeTask(task);

        entityManager.remove(task);
        return true;
    }

    @Transactional
    public Boolean initTasksInRegistration(
            InitTasksInRegistrationDTO initTasksInRegistrationDTO) {
        var listId = initTasksInRegistrationDTO.listCategoryId();
        var statusCategoryDTO = initTasksInRegistrationDTO.statusCategoryDTO();

        var userInfo = userInfoService.getCurrentUserInfo();
        var statusColumns = statusCategoryDTO.statusColumns();

        var inProgressStatus = StatusPosition.builder()
                .orderIndex(1).name(statusColumns.get(1).title())
                .columnId(statusColumns.get(1).id()).build();

        var finishedStatus = StatusPosition.builder()
                .orderIndex(1).name(statusColumns.get(2).title())
                .columnId(statusColumns.get(2).id()).build();

        var todoStatus1 = StatusPosition.builder()
                .orderIndex(1).name(statusColumns.get(0).title())
                .columnId(statusColumns.get(0).id()).build();
        var todoStatus2 = StatusPosition.builder()
                .orderIndex(2).name(statusColumns.get(0).title())
                .columnId(statusColumns.get(0).id()).build();
        var todoStatus3 = StatusPosition.builder()
                .orderIndex(3).name(statusColumns.get(0).title())
                .columnId(statusColumns.get(0).id()).build();

        var noPriority1 = PriorityPosition.builder()
                .columnId(1).orderIndex(1)
                .name(Priority.NO_PRIORITY).build();
        var noPriority2 = PriorityPosition.builder()
                .columnId(1).orderIndex(2)
                .name(Priority.NO_PRIORITY).build();
        var noPriority3 = PriorityPosition.builder()
                .columnId(1).orderIndex(3)
                .name(Priority.NO_PRIORITY).build();

        var highPriority1 = PriorityPosition.builder()
                .columnId(2).orderIndex(1)
                .name(Priority.HIGH).build();

        var normalPriority = PriorityPosition.builder()
                .columnId(4).orderIndex(1)
                .name(Priority.NORMAL).build();

        var desc = "Write some description for the task";
        var inProgressTask = Task.builder()
                .listId(listId)
                .status(inProgressStatus)
                .priority(noPriority1)
                .description(desc)
                .title("Look! Some progress 💪")
                .build();

        var todoTask1 = Task.builder()
                .listId(listId)
                .status(todoStatus1)
                .priority(noPriority2)
                .title("Try drag task 🖐➡")
                .build();

        var todoTask2 = Task.builder()
                .listId(listId)
                .status(todoStatus2)
                .priority(highPriority1)
                .title("👇 Try change priority")
                .build();

        var todoTask3 = Task.builder()
                .listId(listId)
                .status(todoStatus3)
                .priority(noPriority3)
                .title("👇 Try change due date")
                .expectedDueDate(LocalDateTime.now())
                .build();

        var finishedTask = Task.builder()
                .listId(listId)
                .status(finishedStatus)
                .description("Done! This task is hidden from 'group by' priority/due date")
                .priority(normalPriority)
                .title("✔ Finished task")
                .build();

        var taskList = List.of(inProgressTask,
                todoTask1, todoTask2, todoTask3, finishedTask);
        taskList.forEach(task -> {
            userInfo.addTask(task);
            task.addWatcher(userInfo);
            task.addAssignee(userInfo);
        });

        repository.saveAll(taskList);
        return true;
    }
}
