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
    @Modifying
    @Query(
        value = "UPDATE task SET title = :title WHERE id = :taskId",
        nativeQuery = true
    )
    Integer updateTaskTitle(
        @Param("title") String title,
        @Param("taskId") Integer taskId
    );

    @Modifying
    @Query(
        value = "UPDATE task SET updated_at = :updatedAt WHERE id = :taskId",
        nativeQuery = true
    )
    Integer renewTaskUpdatedAt(
        @Param("updatedAt") LocalDateTime updatedAt,
        @Param("taskId") Integer taskId
    );

    @Query(value = "SELECT title FROM task WHERE id = :id", nativeQuery = true)
    String getTaskTitle(@Param("id") Integer id);

    @Modifying
    @Query(
        value = "UPDATE task SET description = :description WHERE id = :id",
        nativeQuery = true
    )
    Integer updateTaskDesc(
        @Param("description") String description,
        @Param("id") Integer id
    );
}
