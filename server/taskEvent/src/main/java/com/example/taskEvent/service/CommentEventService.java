package com.example.taskEvent.service;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.taskEvent.dto.CommentEventDTO;
import com.example.taskEvent.model.UpdateEvent;
import com.example.taskEvent.repository.CommentEventRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentEventService {

    private final CommentEventRepository commentEventRepository;

    public Boolean saveComment(
        Integer taskId,
        CommentEventDTO commentEventDTO
    ) {
        return true;
    }
}
