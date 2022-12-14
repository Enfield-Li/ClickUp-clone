package com.example.team.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.team.model.Space;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Integer> {
}
