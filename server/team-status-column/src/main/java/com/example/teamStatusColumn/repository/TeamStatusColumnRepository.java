package com.example.teamStatusColumn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.teamStatusColumn.model.TeamStatusColumn;

@Repository
public interface TeamStatusColumnRepository
        extends JpaRepository<TeamStatusColumn, Integer> {
}
