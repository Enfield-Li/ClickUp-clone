package com.example.devTest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevTestRepository
        extends JpaRepository<Image, Integer> {
}
