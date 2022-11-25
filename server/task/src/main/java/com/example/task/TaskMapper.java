package com.example.task;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.task.model.Task;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.Position;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

@Mapper
public interface TaskMapper {
    @Update("UPDATE status_position" +
            " SET order_index = #{position.orderIndex}" +
            ", column_id = #{position.columnId}" +
            ", name = #{position.name}" +
            " WHERE id = #{id}")
    Integer updateStatusPosition(
            @Param("id") Integer id,
            @Param("position") StatusPosition position);

    @Update("UPDATE due_date_position" +
            " SET order_index = #{position.orderIndex}" +
            ", column_id = #{position.columnId}" +
            ", name = #{position.name}" +
            " WHERE id = #{id}")
    Integer updateDueDatePosition(
            @Param("id") Integer id,
            @Param("position") DueDatePosition position);

    @Update("UPDATE priority_position" +
            " SET order_index = #{position.orderIndex}" +
            ", column_id = #{position.columnId}" +
            ", name = #{position.name}" +
            " WHERE id = #{id}")
    Integer updateTaskPriorityPosition(
            @Param("id") Integer id,
            @Param("tableName") String tableName,
            @Param("position") PriorityPosition position);

    // @Select("SELECT * FROM task WHERE id = #{id}")
    // Optional<Task> findById(@Param("id") Integer id);
}
