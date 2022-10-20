package com.example.taskEvent.controller;

import static com.example.clients.UrlConstants.TASK_EVENT_API_VERSION;

import com.example.taskEvent.model.UpdateEvent;
import com.example.taskEvent.service.UpdateEventService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(TASK_EVENT_API_VERSION)
class UpdateEventController {

    private final UpdateEventService taskEventService;

    @GetMapping("/{taskId}")
    ResponseEntity<List<UpdateEvent>> getAllTaskEvents(
        @PathVariable Integer taskId
    ) {
        var allTaskEvents = taskEventService.getAllTaskEvents(taskId);

        return ResponseEntity.ok(allTaskEvents);
    }
}
