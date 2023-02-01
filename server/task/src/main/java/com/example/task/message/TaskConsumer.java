package com.example.task.message;

import com.example.clients.task.UpdateTaskOnCreateNewColumnDTO;
import com.example.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.example.amqp.ExchangeKey.taskQueue;

@Log4j2
@Component
@RequiredArgsConstructor
public class TaskConsumer {

    private final TaskService service;

    @RabbitListener(queues = taskQueue)
    public void consumeInitEvent(UpdateTaskOnCreateNewColumnDTO eventDTO) {
        log.info("Consumed {} from queue", eventDTO);
        service.updateTaskStatusPositionOnCreateNewColumn(eventDTO);
    }
}
