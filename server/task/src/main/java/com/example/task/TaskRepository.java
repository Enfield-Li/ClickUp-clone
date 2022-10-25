package com.example.task;

import com.example.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Modifying
    @Query(
        value = "UPDATE task SET title = :title WHERE id = :id",
        nativeQuery = true
    )
    Integer updateTaskTitle(
        @Param("title") String title,
        @Param("id") Integer id
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
