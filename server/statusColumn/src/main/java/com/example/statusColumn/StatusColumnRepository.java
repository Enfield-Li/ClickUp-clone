package com.example.statusColumn;

import com.example.statusColumn.model.StatusColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusColumnRepository
    extends JpaRepository<StatusColumn, Integer> {}
