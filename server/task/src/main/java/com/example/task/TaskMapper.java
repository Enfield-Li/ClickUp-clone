package com.example.task;

import java.util.Date;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface TaskMapper {
    @Update(
        "UPDATE ${tableName} SET order_index = #{orderIndex}" +
        " WHERE id = #{id}"
    )
    Integer updateTaskPosition(
        @Param("id") Integer id,
        @Param("tableName") String tableName,
        @Param("orderIndex") Integer orderIndex
    );

    @Update("UPDATE task SET expected_due_date = #{expectedDueDate}")
    Integer updateTaskExpectedDueDate(
        @Param("expectedDueDate") Date expectedDueDate
    );
}
