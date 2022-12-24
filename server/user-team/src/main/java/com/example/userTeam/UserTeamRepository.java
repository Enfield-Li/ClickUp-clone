package com.example.userTeam;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.userTeam.model.UserTeam;

@Repository
public interface UserTeamRepository
        extends JpaRepository<UserTeam, Integer> {

    Optional<UserTeam> findByUserId(Integer userId);
    
    Boolean existsByUserId(Integer userId);

    @Query(nativeQuery = true, value = "")
    Integer updateJoinedTeamId(Integer userId, Integer teamId);
}
