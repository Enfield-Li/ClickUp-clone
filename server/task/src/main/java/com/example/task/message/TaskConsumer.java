package com.example.task.message;

import com.example.clients.task.UpdateTaskStatusOnAddingColumnDTO;
import com.example.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Set;

import static com.example.amqp.ExchangeKey.*;

@Log4j2
@Component
@RequiredArgsConstructor
public class TaskConsumer {

    private final TaskService service;

    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = internalExchange),
            value = @Queue(value = updateTaskStatusOnAddingNewColumnQueue),
            key = updateTaskStatusOnAddingNewColumnRoutingKey))
    public void updateTaskStatus(
            UpdateTaskStatusOnAddingColumnDTO eventDTO) {
        log.info("Consumed {} from UpdateTaskStatusOnAddingNewColumn queue",
                eventDTO);
        service.updateTaskStatusOnAddingNewColumn(eventDTO);
    }

    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = internalExchange),
            value = @Queue(value = deleteTasksQueue),
            key = deleteTasksRoutingKey))
    public void deleteTaskIds(Set<Integer> listIds) {
        log.info("Consumed {} from deleteTasks queue", listIds);
        service.deleteTasksByListId(listIds);
    }
}
