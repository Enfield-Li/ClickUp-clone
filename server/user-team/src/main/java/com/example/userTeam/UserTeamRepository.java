package com.example.userTeam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.userTeam.model.UserTeam;

@Repository
public interface UserTeamRepository
        extends JpaRepository<UserTeam, Integer> {
}
