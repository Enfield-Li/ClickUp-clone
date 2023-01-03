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
    Integer updateStatusColumnTitle(
            @Param("id") Integer id,
            @Param("title") String title);

    @Query(nativeQuery = true, value = ""
            + "UPDATE status_column"
            + " SET color = :color"
            + " WHERE id = :id")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateStatusColumnColor(
            @Param("id") Integer id,
            @Param("color") String color);

    @Query(nativeQuery = true, value = ""
            + "UPDATE status_column"
            + " SET order_index = :orderIndex"
            + " WHERE id = :id")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateStatusColumnOrderIndex(
            @Param("id") Integer id,
            @Param("orderIndex") Integer orderIndex);

    @Query(nativeQuery = true, value = ""
            + "INSERT INTO status_column"
            + " (title, color, order_index, status_category_id)"
            + " VALUES (:title, :color, :orderIndex, :categoryId)")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer createStatusColumnForCategory(
            @Param("title") String title,
            @Param("color") String color,
            @Param("orderIndex") Integer orderIndex,
            @Param("categoryId") Integer categoryId);

    @Query(nativeQuery = true, value = ""
            + " SELECT LAST_INSERT_ID(id)"
            + " FROM status_column"
            + " ORDER BY LAST_INSERT_ID(id)"
            + " DESC LIMIT 1")
    Integer getLastInsertedStatusColumnId();
}