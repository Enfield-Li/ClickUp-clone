package com.example.team.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.team.model.Team;

@Repository
public interface TeamRepository
        extends JpaRepository<Team, Integer> {

    List<Team> findByIdIn(List<Integer> teamIds);

    List<Team> findByMembersUserId(Integer userId);

}
