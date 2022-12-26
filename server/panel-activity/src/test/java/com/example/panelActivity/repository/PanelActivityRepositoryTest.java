package com.example.panelActivity.repository;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.panelActivity.model.PanelActivity;

@DataJpaTest
@Transactional
public class PanelActivityRepositoryTest implements WithAssertions {

    @Autowired
    PanelActivityRepository underTest;

    Integer teamId = 3;
    Integer userId = 10;
    Integer panelActivityId;

    @BeforeEach
    void setUp() {
        var panelActivity = PanelActivity.builder()
                .userId(userId).defaultTeamId(teamId).build();
        underTest.saveAndFlush(panelActivity);
        panelActivityId = panelActivity.getId();
    }

    @Test
    void test_find_by_user_id_should_pass() {
        var actualResult = underTest.findByUserId(userId);
        assertThat(actualResult).isNotEmpty();
    }

    @Test
    void test_find_by_user_id_should_fail() {
        var actualResult = underTest.findByUserId(13);
        assertThat(actualResult).isEmpty();
    }

    @Test
    void test_find_PanelActivity_id_by_user_id_should_pass() {
        var actualResult = underTest.findPanelActivityIdByUserId(userId);
        assertThat(actualResult).isEqualTo(panelActivityId);
    }

    @Test
    void test_find_PanelActivity_id_by_user_id_should_fail() {
        var actualResult = underTest.findPanelActivityIdByUserId(31);
        assertThat(actualResult).isNull();
    }

    @Test
    void test_update_default_team_id_should_pass() {
        // given
        var expectedTeamId = 4;

        // when
        var actualResult = underTest.updateDefaultTeamId(
                userId, expectedTeamId);

        // then
        assertThat(actualResult).isGreaterThan(0);

        var panelActivity = underTest.findByUserId(userId).orElseThrow();
        System.out.println(panelActivity);
        assertThat(panelActivity.getDefaultTeamId())
                .isEqualTo(expectedTeamId);
    }

    @Test
    void test_update_default_team_id_should_fail() {
        // given
        var expectedTeamId = 4;

        // when
        var actualResult = underTest.updateDefaultTeamId(
                11, expectedTeamId);

        // then
        assertThat(actualResult).isEqualTo(0);

        var panelActivity = underTest.findByUserId(userId).orElseThrow();
        System.out.println(panelActivity);
        assertThat(panelActivity.getDefaultTeamId()).isEqualTo(teamId);
    }
}
