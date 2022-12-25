package com.example.panelActivity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.panelActivity.model.TeamActivity;

@Repository
public interface TeamActivityRepository extends JpaRepository<TeamActivity, Integer> {

    // @Modifying
    // @Query(nativeQuery = true, value = ""
    //         + "UPDATE team_activity"
    //         + " SET space_id = :spaceId"
    //         + " WHERE team_id = :teamId")
    // Integer updateOpenedSpaceId(@Param("teamId") Integer teamId,
    //         @Param("spaceId") Integer spaceId);

    // @Modifying
    // @Query(nativeQuery = true, value = ""
    //         + "INSERT INTO team_activity"
    //         + " (team_id, space_id)"
    //         + " VALUES (:teamId, :spaceId)")
    // Integer createNewTeamActivity(@Param("teamId") Integer teamId,
    //         @Param("spaceId") Integer spaceId);
}
