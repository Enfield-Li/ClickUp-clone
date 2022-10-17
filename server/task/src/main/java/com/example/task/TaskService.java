package com.example.task;

import static com.example.amqp.exchange.TaskEventExchange.*;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.taskEvent.eventDTO.TaskEventDTO;
import com.example.task.dto.UpdateTaskDescDTO;
import com.example.task.dto.UpdateTaskTitleDTO;
import com.example.task.dto.UpdateTasksPositionDTO;
import com.example.task.model.PreviousTask;
import com.example.task.model.Task;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final EntityManager entityManager;
    private final TaskRepository taskRepository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        // Manage relationship
        setTaskForWatcher(task);
        return taskRepository.save(task);
    }

    @Transactional
    public Boolean updateTasksPosition(
        UpdateTasksPositionDTO updateTasksPositionDTO
    ) {
        // When updating sourceTask, a new event will be created for it
        // need to manage/update it's relationship with event and the nested participant
        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();
        var taskList = updateTasksPositionDTO.taskList();

        var sourceTask = taskList
            .stream()
            .filter(task -> task.id() == sourceTaskId)
            .findAny();

        rabbitMQMessageProducer.publish(
            internalExchange,
            taskEventRoutingKey,
            sourceTask.get().taskEvents()
        );

        // DTO to entity
        var tasks = new ArrayList<Task>();
        taskList.forEach(
            taskDTO -> {
                var task = Task
                    .builder()
                    .id(taskDTO.id())
                    .title(taskDTO.title())
                    .status(taskDTO.status())
                    .dueDate(taskDTO.dueDate())
                    .priority(taskDTO.priority())
                    .description(taskDTO.description())
                    .creatorId(taskDTO.creatorId())
                    .creatorName(taskDTO.creatorName())
                    .previousTask(taskDTO.previousTask())
                    .previousTaskBeforeFinish(
                        taskDTO.previousTaskBeforeFinish()
                    )
                    .watchers(taskDTO.watchers())
                    .assignees(taskDTO.assignees())
                    .build();

                setTaskFroWatcherAndAssignee(task);
                tasks.add(task);
            }
        );

        taskRepository.saveAll(tasks);
        return true;
    }

    @Transactional
    public Boolean updateTaskTitle(UpdateTaskTitleDTO updateTaskTitleDTO) {
        var id = updateTaskTitleDTO.id();
        var newTitle = updateTaskTitleDTO.newTitle();

        return taskRepository.updateTaskTitle(newTitle, id) > 0;
    }

    @Transactional
    public Boolean updateTaskDesc(UpdateTaskDescDTO updateTaskDescDTO) {
        var id = updateTaskDescDTO.id();
        var newDesc = updateTaskDescDTO.newDesc();

        return taskRepository.updateTaskDesc(newDesc, id) > 0;
    }

    private Task setTaskFroWatcherAndAssignee(Task task) {
        return setTaskForAssignee(setTaskForWatcher(task));
    }

    private Task setTaskForAssignee(Task task) {
        task.getAssignees().forEach(assignee -> assignee.setTaskAssignee(task));
        return task;
    }

    private Task setTaskForWatcher(Task task) {
        task.getWatchers().forEach(watcher -> watcher.setTaskWatcher(task));
        return task;
    }
}
