package com.example.teamStatusCategory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.teamStatusCategory.model.StatusColumn;

@Repository
public interface StatusColumnRepository
        extends JpaRepository<StatusColumn, Integer> {
}
