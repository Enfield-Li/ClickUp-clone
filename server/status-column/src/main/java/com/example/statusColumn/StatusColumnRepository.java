package com.example.statusColumn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.statusColumn.model.StatusColumn;

@Repository
public interface StatusColumnRepository
        extends JpaRepository<StatusColumn, Integer> {
}
