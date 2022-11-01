package com.example.task;

import com.example.task.model.Task;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query(value = "SELECT title FROM task WHERE id = :id", nativeQuery = true)
    String getTaskTitle(@Param("id") Integer id);

    @Modifying
    @Query(
        value = "UPDATE task" +
        " SET title = :title" +
        ", updated_at = :updatedAt" +
        " WHERE id = :taskId",
        nativeQuery = true
    )
    Integer updateTaskTitle(
        @Param("taskId") Integer taskId,
        @Param("title") String title,
        @Param("updatedAt") LocalDateTime updatedAt
    );

    @Modifying
    @Query(
        value = "UPDATE task" +
        " SET description = :description" +
        ", updated_at = :updatedAt" +
        " WHERE id = :taskId",
        nativeQuery = true
    )
    Integer updateTaskDesc(
        @Param("taskId") Integer taskId,
        @Param("description") String description,
        @Param("updatedAt") LocalDateTime updatedAt
    );
}
