package com.example.taskEvent;

import com.example.taskEvent.model.TaskEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskEventRepository extends JpaRepository<TaskEvent, Integer> {
  List<TaskEvent> findAllByTaskId(Integer taskId);
}
