package com.example.devTest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.devTest.model.StatusColumn;

@Repository
public interface StatusColumnRepository
        extends JpaRepository<StatusColumn, Integer> {
}
