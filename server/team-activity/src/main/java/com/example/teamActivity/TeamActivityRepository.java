package com.example.teamActivity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamActivityRepository extends JpaRepository<TeamActivity, Integer> {

    // @Modifying
    // @Query(nativeQuery = true, value = ""
    //         + "UPDATE team_activity"
    //         + " SET space_id = :spaceId"
    //         + " WHERE team_id = :teamId")
    // Integer updateOpenedSpaceId(@Param("teamId") Integer teamId,
    //         @Param("spaceId") Integer spaceId);

    // @Modifying(clearAutomatically = true, flushAutomatically = true)
    // @Query(nativeQuery = true, value = ""
    //         + "INSERT INTO team_activity"
    //         + " (team_id, space_id, panel_activity_id)"
    //         + " VALUES (:teamId, :spaceId, :panelActivityId)")
    // Integer createNewTeamActivity(@Param("teamId") Integer teamId,
    //         @Param("spaceId") Integer spaceId,
    //         @Param("panelActivityId") Integer panelActivityId);
}