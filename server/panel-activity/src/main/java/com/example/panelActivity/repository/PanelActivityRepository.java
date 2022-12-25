package com.example.panelActivity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.panelActivity.model.PanelActivity;

@Repository
public interface PanelActivityRepository
        extends JpaRepository<PanelActivity, Integer> {

    Optional<PanelActivity> findByUserId(Integer userId);

    Boolean existsByUserId(Integer userId);

    @Modifying
    @Query(nativeQuery = true, value = ""
            + "UPDATE panel_activity"
            + " SET default_team_id = :teamId"
            + " WHERE user_id = :userId")
    Integer updateDefaultTeamId(@Param("userId") Integer userId,
            @Param("teamId") Integer teamId);
}
