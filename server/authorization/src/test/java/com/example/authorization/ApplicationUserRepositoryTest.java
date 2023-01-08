package com.example.authorization;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest
@Transactional
public class ApplicationUserRepositoryTest implements WithAssertions {

    @Autowired
    ApplicationUserRepository underTest;

    Integer userId;
    Integer joinedTeamCount = 3;

    @BeforeEach
    void setUp() {
        var applicationUser = ApplicationUser.builder()
                .username("mockUser")
                .password("password")
                .email("mockEmail@gmail.com")
                .joinedTeamCount(joinedTeamCount)
                .build();

        underTest.saveAndFlush(applicationUser);
        userId = applicationUser.getId();
    }

    @Test
    void test_update_user_joined_team_count_plus_one_should_pass() {
        // given
        var teamId = 22;
        var updateTeamCount = 1;

        // when
        var actualResult = underTest.updateUserJoinedTeamCount(
                userId, teamId, updateTeamCount);

        // then
        assertThat(actualResult).isEqualTo(1);
        var applicationUser = underTest.findById(userId).orElseThrow();
        assertThat(applicationUser.getJoinedTeamCount())
                .isEqualTo(joinedTeamCount + updateTeamCount);
        assertThat(applicationUser.getDefaultTeamId())
                .isEqualTo(teamId);
    }

    @Test
    void test_update_user_joined_team_count_minus_one_should_pass() {
        // given
        var teamId = 22;
        var updateTeamCount = -1;

        // when
        var actualResult = underTest.updateUserJoinedTeamCount(
                userId, teamId, updateTeamCount);

        // then
        assertThat(actualResult).isEqualTo(1);
        var applicationUser = underTest.findById(userId).orElseThrow();
        assertThat(applicationUser.getJoinedTeamCount())
                .isEqualTo(joinedTeamCount + updateTeamCount);
    }

    @Test
    void test_update_user_joined_team_count_should_fail() {
        // given
        var teamId = 22;
        var userIdNotExist = 10;
        var updateTeamCount = -1;

        // when
        var actualResult = underTest.updateUserJoinedTeamCount(
                userIdNotExist, teamId, updateTeamCount);

        // then
        assertThat(actualResult).isEqualTo(0);
    }
}
