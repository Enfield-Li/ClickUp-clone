package com.example.authorization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationUserRepository
        extends JpaRepository<ApplicationUser, Integer> {

    Boolean existsByEmail(String email);

//    Boolean existsByUsername(String username);
//    Optional<ApplicationUser> findByUsername(String username);

    Optional<ApplicationUser> findByEmail(String email);

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
