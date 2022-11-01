package com.example.taskEvent.service;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.taskEvent.model.UpdateEvent;
import com.example.taskEvent.repository.AssignmentEventRepository;
import com.example.taskEvent.repository.UpdateEventRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskEventService {

    private final UpdateEventRepository updateEventRepository;
    private final AssignmentEventRepository assignmentEventRepository;
    
    public void addUpdateEvent(UpdateEventDTO updateEventDTO) {
        var taskEvent = UpdateEvent.toUpdateEvent(updateEventDTO);
        updateEventRepository.save(taskEvent);
    }

    public List<UpdateEvent> getAllTaskEvents(Integer taskId) {
        return updateEventRepository.findAllByTaskId(taskId);
    }

    public void purgeAllEventForTask(Integer taskId) {
        updateEventRepository.deleteByTaskId(taskId);
        assignmentEventRepository.deleteByTaskId(taskId);
    }
}
