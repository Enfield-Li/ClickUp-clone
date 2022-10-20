package com.example.taskEvent.queue;

import static com.example.amqp.exchange.TaskEventExchange.*;

import com.example.clients.notification.NotificationRequest;
import com.example.clients.taskEvent.updateEventDTO.UpdateEventDTO;
import com.example.taskEvent.service.UpdateEventService;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final UpdateEventService taskEventService;

    @RabbitListener(queues = taskEventQueue)
    public void consumer(List<UpdateEventDTO> updateEventDTO) {
        log.info("Consumed {} from queue", updateEventDTO.get(0).toString());
        taskEventService.addTaskEvent(updateEventDTO.get(0));
    }
}
