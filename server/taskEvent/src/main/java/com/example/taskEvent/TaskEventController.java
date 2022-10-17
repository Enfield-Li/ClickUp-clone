package com.example.taskEvent;

import static com.example.clients.UrlConstants.*;

import com.example.taskEvent.model.TaskEvent;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TASK_EVENT_API_VERSION)
class TaskEventController {

    private final TaskEventService taskEventService;

    @GetMapping
    ResponseEntity<List<TaskEvent>> getAllTaskEvents(
        @RequestParam Integer taskId
    ) {
        var allTaskEvents = taskEventService.getAllTaskEvents(taskId);

        return ResponseEntity.ok(allTaskEvents);
    }
}
