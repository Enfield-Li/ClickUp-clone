package com.example.taskEvent.message;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.taskEvent.service.TaskEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.example.amqp.ExchangeKey.*;

@Log4j2
@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final TaskEventService taskEventService;

    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = internalExchange),
            value = @Queue(value = taskEventQueue),
            key = taskEventRoutingKey))
    public void consumeUpdateEvent(UpdateEventDTO updateEventDTO) {
        log.info("Consumed {} from queue", updateEventDTO.toString());
        taskEventService.addUpdateEvent(updateEventDTO);
    }
}
