package com.example.taskEvent.service;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.taskEvent.model.UpdateEvent;
import com.example.taskEvent.repository.UpdateEventRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskEventService {

    private final UpdateEventRepository updateEventRepository;

    public void addUpdateEvent(UpdateEventDTO updateEventDTO) {
        var taskEvent = UpdateEvent.toUpdateEvent(updateEventDTO);
        updateEventRepository.save(taskEvent);
    }

    public List<UpdateEvent> getAllTaskEvents(Integer taskId) {
        return updateEventRepository.findAllByTaskId(taskId);
    }
}
