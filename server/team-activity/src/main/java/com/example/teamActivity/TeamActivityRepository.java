package com.example.teamActivity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamActivityRepository
        extends JpaRepository<TeamActivity, Integer> {

    Optional<TeamActivity> findByTeamIdAndUserId(
            Integer teamId, Integer userId);

    Boolean existsByTeamIdAndUserId(
            Integer teamId, Integer userId);

    // @Modifying
    // @Query(nativeQuery = true, value = ""
    //         + "UPDATE team_activity"
    //         + " SET space_id = :spaceId"
    //         + " WHERE team_id = :teamId")
    // Integer updateOpenedSpaceId(@Param("teamId") Integer teamId,
    //         @Param("spaceId") Integer spaceId);
}
