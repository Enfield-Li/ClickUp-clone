package com.example.team.repository;

import com.example.team.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TeamRepository
        extends JpaRepository<Team, Integer> {

    Set<Team> findByIdIn(List<Integer> teamIds);

    Set<Team> findByMembersUserId(Integer userId);

    Boolean existsByMembersUserId(Integer userId);
}
