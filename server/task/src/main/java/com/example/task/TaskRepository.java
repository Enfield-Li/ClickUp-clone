package com.example.task;

import com.example.task.model.Task;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Optional<Task> findByTitle(String title);

    @Query(nativeQuery = true, value = "SELECT title FROM task WHERE id = :id")
    String getTaskTitle(@Param("id") Integer id);

    // @Query(
    //     nativeQuery = true,
    //     value = "UPDATE taskDueDatePosition SET order_index = : orderIndex" +
    //     " WHERE task_id = :taskId"
    // )
    // @Modifying(clearAutomatically = true)
    // Integer updateTaskStatusPosition(
    //     @Param("taskId") Integer taskId,
    //     @Param("orderIndex") Integer orderIndex
    // );

    @Query(
        nativeQuery = true,
        value = "UPDATE task" +
        " SET title = :title" +
        ", updated_at = :updatedAt" +
        " WHERE id = :taskId"
    )
    @Modifying(clearAutomatically = true)
    Integer updateTaskTitle(
        @Param("taskId") Integer taskId,
        @Param("title") String title,
        @Param("updatedAt") LocalDateTime updatedAt
    );

    @Query(
        nativeQuery = true,
        value = "UPDATE task" +
        " SET description = :description" +
        ", updated_at = :updatedAt" +
        " WHERE id = :taskId"
    )
    @Modifying(clearAutomatically = true)
    Integer updateTaskDesc(
        @Param("taskId") Integer taskId,
        @Param("description") String description,
        @Param("updatedAt") LocalDateTime updatedAt
    );
}
