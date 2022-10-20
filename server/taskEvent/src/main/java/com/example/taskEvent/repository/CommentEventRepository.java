package com.example.taskEvent.repository;

import com.example.taskEvent.model.CommentEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentEventRepository
    extends JpaRepository<CommentEvent, Integer> {
    List<CommentEvent> findAllByTaskId(Integer taskId);
}
