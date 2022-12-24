package com.example.panelActivity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.panelActivity.model.TeamActivity;

@Repository
public interface TeamActivityRepository extends JpaRepository<TeamActivity, Integer> {

    @Query(nativeQuery = true, value = ""
            + "UPDATE team_activity"
            + " SET space_id = :spaceId"
            + " WHERE team_id = :teamId")
    Integer updateOpenedSpaceId(Integer teamId, Integer spaceId);
}
