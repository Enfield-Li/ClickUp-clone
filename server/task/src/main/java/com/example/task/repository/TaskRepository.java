package com.example.task.repository;

import com.example.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Optional<Task> findByTitle(String title);

    List<Task> findByListId(Integer listId);

    @Query(nativeQuery = true, value = "" +
            "SELECT title FROM task WHERE id = :id")
    String getTaskTitle(@Param("id") Integer id);

    @Query(nativeQuery = true, value = "" +
            "UPDATE task" +
            " SET title = :title" +
            ",updated_at = :updatedAt" +
            " WHERE id = :taskId")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateTitle(
            @Param("taskId") Integer taskId,
            @Param("title") String title,
            @Param("updatedAt") LocalDateTime updatedAt);

    @Query(nativeQuery = true, value = "" +
            "UPDATE task" +
            " SET description = :description" +
            ",updated_at = :updatedAt" +
            " WHERE id = :taskId")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateDesc(
            @Param("taskId") Integer taskId,
            @Param("description") String description,
            @Param("updatedAt") LocalDateTime updatedAt);

//    @Query(nativeQuery = true, value = "" +
//            "UPDATE task" +
//            " SET description = :description" +
//            ",updated_at = :updatedAt" +
//            " WHERE id = :taskId")
//    @Modifying(clearAutomatically = true, flushAutomatically = true)
//    Integer updateTasksStatusId(
//            @Param("taskId") Integer taskId,
//            @Param("description") String description,
//            @Param("updatedAt") LocalDateTime updatedAt);
}
