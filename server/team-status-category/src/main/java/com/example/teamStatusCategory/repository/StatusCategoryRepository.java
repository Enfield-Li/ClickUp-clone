package com.example.teamStatusCategory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.teamStatusCategory.model.StatusCategory;

@Repository
public interface StatusCategoryRepository
        extends JpaRepository<StatusCategory, Integer> {

    List<StatusCategory> findAllByTeamId(Integer teamId);

    @Query(nativeQuery = true, value = ""
            + "UPDATE status_category"
            + " SET name = :name"
            + " WHERE id = :id")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    Integer updateStatusCategoryName(@Param("id") Integer id,
            @Param("name") String name);
}
