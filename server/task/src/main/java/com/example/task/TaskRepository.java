package com.example.task;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.task.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Optional<Task> findByTitle(String title);

    @Query(nativeQuery = true, value = "" +
            "SELECT title FROM task WHERE id = :id")
    String getTaskTitle(@Param("id") Integer id);

    @Query(nativeQuery = true, value = "" +
            "UPDATE task" +
            " SET title = :title" +
            ", updated_at = :updatedAt" +
            " WHERE id = :taskId")
    @Modifying(clearAutomatically = true)
    Integer updateTitle(
            @Param("taskId") Integer taskId,
            @Param("title") String title,
            @Param("updatedAt") LocalDateTime updatedAt);

    @Query(nativeQuery = true, value = "" +
            "UPDATE task" +
            " SET description = :description" +
            ", updated_at = :updatedAt" +
            " WHERE id = :taskId")
    @Modifying(clearAutomatically = true)
    Integer updateDesc(
            @Param("taskId") Integer taskId,
            @Param("description") String description,
            @Param("updatedAt") LocalDateTime updatedAt);
}
