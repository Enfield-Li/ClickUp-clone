package com.example.authorization;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationUserRepository
        extends JpaRepository<ApplicationUser, Integer> {
    public Boolean existsByUsername(String username);

    public Boolean existsByEmail(String email);

    public Optional<ApplicationUser> findByUsername(String username);

    public Optional<ApplicationUser> findByEmail(String email);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(nativeQuery = true, value = ""
            + "UPDATE application_user"
            + " SET joined_team_count = joined_team_count + :updateTeamCount"
            + ",default_team_id = :teamId"
            + " WHERE id = :userId")
    Integer updateUserJoinedTeamCount(
            @Param("userId") Integer userId,
            @Param("teamId") Integer teamId,
            @Param("updateTeamCount") Integer updateTeamCount);
}
