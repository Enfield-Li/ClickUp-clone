package com.example.task;

import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface TaskMapper {

    @Update("UPDATE ${tableName}" +
            " SET order_index = #{position.orderIndex}" +
            ", column_id = #{position.columnId}" +
            ", name = #{position.name}" +
            " WHERE id = #{id}")
    <T> Integer updateTaskPosition(
            @Param("id") Integer id,
            @Param("tableName") String tableName,
            @Param("position") T position);

    @Update("UPDATE task" +
            " SET expected_due_date = #{expectedDueDate}" +
            " WHERE id = #{taskId}")
    Integer updateExpectedDueDate(
            @Param("taskId") Integer taskId,
            @Param("expectedDueDate") LocalDateTime expectedDueDate);

}