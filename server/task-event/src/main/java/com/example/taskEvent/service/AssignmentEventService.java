package com.example.taskEvent.service;

import com.example.taskEvent.repository.AssignmentEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssignmentEventService {

    private final AssignmentEventRepository assignmentEventRepository;

    public Boolean saveAssignment() {
        return true;
    }
}
