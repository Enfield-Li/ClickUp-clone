package com.example.teamStatusCategory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.teamStatusCategory.model.StatusColumn;

@Repository
public interface StatusColumnRepository
        extends JpaRepository<StatusColumn, Integer> {

    @Query(nativeQuery = true, value = ""
            + "UPDATE status_column"
            + " SET title = :title"
            + " WHERE id = :id")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateStatusColumnTitle(@Param("id") Integer id,
            @Param("title") String title);

    @Query(nativeQuery = true, value = ""
            + "UPDATE status_column"
            + " SET color = :color"
            + " WHERE id = :id")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateStatusColumnColor(@Param("id") Integer id,
            @Param("color") String color);

    @Query(nativeQuery = true, value = ""
            + "UPDATE status_column"
            + " SET order_index = :orderIndex"
            + " WHERE id = :id")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateStatusColumnOrderIndex(@Param("id") Integer id,
            @Param("orderIndex") Integer orderIndex);
}