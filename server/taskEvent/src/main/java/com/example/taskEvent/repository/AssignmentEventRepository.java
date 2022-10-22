package com.example.taskEvent.repository;

import com.example.taskEvent.model.AssignmentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentEventRepository
    extends JpaRepository<AssignmentEvent, Integer> {}
