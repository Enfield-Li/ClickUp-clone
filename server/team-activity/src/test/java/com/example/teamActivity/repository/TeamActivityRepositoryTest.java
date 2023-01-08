package com.example.teamActivity.repository;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.teamActivity.TeamActivityRepository;

@DataJpaTest
@Transactional
public class TeamActivityRepositoryTest implements WithAssertions {

    @Autowired
    TeamActivityRepository underTest;

    Integer teamId = 2;
    Integer panelActivityId;

    @BeforeEach
    void setUp() {
        // var panelActivity = PanelActivity.builder()
        //         .userId(13).defaultTeamId(teamId).build();
        // panelActivityRepository.saveAndFlush(panelActivity);
        // panelActivityId = panelActivity.getId();
    }

    @Test
    void test_create_new_team_activity_should_pass() {
        // // given
        // var spaceId = 3;

        // // when
        // var actualResult = underTest.createNewTeamActivity(teamId, spaceId, panelActivityId);

        // // then
        // var allTeamActivityList = underTest.findAll();
        // assertThat(allTeamActivityList.get(0).getTeamId())
        //         .isEqualTo(teamId);
        // assertThat(allTeamActivityList.get(0).getSpaceId())
        //         .isEqualTo(spaceId);
        // assertThat(actualResult).isEqualTo(1);
    }
}
