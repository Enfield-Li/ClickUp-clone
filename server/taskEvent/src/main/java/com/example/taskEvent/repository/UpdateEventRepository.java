package com.example.taskEvent.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.taskEvent.model.UpdateEvent;

@Repository
public interface UpdateEventRepository
    extends JpaRepository<UpdateEvent, Integer> {
    List<UpdateEvent> findAllByTaskId(Integer taskId);
}
