package com.example.taskEvent.repository;

import com.example.taskEvent.model.UpdateEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateEventRepository
    extends JpaRepository<UpdateEvent, Integer> {
    List<UpdateEvent> findAllByTaskId(Integer taskId);

    void deleteByTaskId(Integer taskId);
}
