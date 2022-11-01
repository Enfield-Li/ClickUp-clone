package com.example.taskEvent.message;

import static com.example.amqp.exchange.TaskEventExchange.*;

import com.example.clients.notification.NotificationRequest;
import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.taskEvent.service.TaskEventService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final TaskEventService taskEventService;

    @RabbitListener(queues = taskEventQueue)
    public void consumeUpdateEvent(UpdateEventDTO updateEventDTO) {
        log.info("Consumed {} from queue", updateEventDTO.toString());
        taskEventService.addUpdateEvent(updateEventDTO);
    }
}
