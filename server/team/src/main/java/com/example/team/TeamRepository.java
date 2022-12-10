package com.example.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.team.model.Team;

@Repository
public interface TeamRepository
        extends JpaRepository<Team, Integer> {
}
