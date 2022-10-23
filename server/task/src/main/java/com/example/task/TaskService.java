package com.example.task;

import static com.example.amqp.exchange.TaskEventExchange.internalExchange;
import static com.example.amqp.exchange.TaskEventExchange.taskEventRoutingKey;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.task.dto.UpdateTaskDescDTO;
import com.example.task.dto.UpdateTaskTitleDTO;
import com.example.task.dto.UpdateTasksPositionDTO;
import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.Task;
import java.util.ArrayList;
import java.util.List;
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

    public Task createTask(CreateTaskDTO createTaskDTO) {
        // TODO: Manage relationship
        // setTaskForWatcher(task);
        return taskRepository.save(
            Task.createTaskDtoToTask(createTaskDTO, 3, "user")
        );
    }

    @Transactional
    public Boolean updateTasksPosition(
        UpdateTasksPositionDTO updateTasksPositionDTO
    ) {
        // When updating sourceTask, a new event will be created for it
        var sourceTaskId = updateTasksPositionDTO.sourceTaskId();
        var taskDtoList = updateTasksPositionDTO.taskDtoList();

        var sourceTask = taskDtoList
            .stream()
            .filter(task -> task.id() == sourceTaskId)
            .findAny();

        // publish task update event
        rabbitMQMessageProducer.publish(
            internalExchange,
            taskEventRoutingKey,
            sourceTask.get().taskEvents()
        );

        // DTO to entity
        var tasks = new ArrayList<Task>();
        taskDtoList.forEach(
            taskDTO -> {
                var task = Task.updateTaskDtoToTask(taskDTO, 1, "user");
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
