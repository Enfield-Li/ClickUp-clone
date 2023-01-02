package com.example.teamStatusCategory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.teamStatusCategory.model.StatusCategory;

@Repository
public interface StatusCategoryRepository
        extends JpaRepository<StatusCategory, Integer> {

    List<StatusCategory> findAllByTeamId(Integer teamId);
}
