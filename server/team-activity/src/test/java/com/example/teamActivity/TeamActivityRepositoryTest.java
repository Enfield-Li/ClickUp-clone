package com.example.teamActivity;

import java.util.Set;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.teamActivity.TeamActivity;
import com.example.teamActivity.TeamActivityRepository;

@DataJpaTest
@Transactional
public class TeamActivityRepositoryTest implements WithAssertions {

    @Autowired
    TeamActivityRepository underTest;

    Integer id;
    final Integer teamId = 321;
    final Integer userId = 156;
    final Integer listId = 456;
    final Integer spaceId = 123;
    final Integer folderId = 654;

    Integer panelActivityId;

    @BeforeEach
    void setUp() {
        var teamActivity = TeamActivity.builder()
                .teamId(teamId).listId(listId).userId(userId)
                .folderIds(Set.of(folderId)).build();
        id = underTest.save(teamActivity).getId();
    }

    @Test
    void test_exists_by_team_id_and_user_id() {
        // given  
        // when
        var actualResult = underTest.existsByTeamIdAndUserId(teamId, userId);

        // then
        assertThat(actualResult).isTrue();
    }

    @Test
    void test_exists_by_team_id_and_user_id_should_fail() {
        // given 
        // when
        var actualResult = underTest.existsByTeamIdAndUserId(1, 2);

        // then
        assertThat(actualResult).isFalse();
    }

    @Test
    void test_find_by_team_id_and_user_id() {
        // given  
        // when
        var actualResult = underTest.findByTeamIdAndUserId(teamId, userId);

        // then
        assertThat(actualResult).isNotEmpty();
    }

    @Test
    void test_find_by_team_id_and_user_id_should_fail() {
        // given  
        // when
        var actualResult = underTest.findByTeamIdAndUserId(1, 2);

        // then
        assertThat(actualResult).isEmpty();
    }

    @Test
    void test_update_opened_list() {
        // given  
        var expectedListId = 1221;

        // when
        var actualResult = underTest.updateOpenedList(teamId, expectedListId);

        // then
        assertThat(actualResult).isGreaterThan(0);

        var entity = underTest.findById(id).orElseThrow();
        assertThat(entity.getListId()).isEqualTo(expectedListId);
    }

    @Test
    void test_update_opened_space() {
        // given  
        var expectedSpaceId = 4141;

        // when
        var actualResult = underTest.updateOpenedSpace(teamId, expectedSpaceId);

        // then
        assertThat(actualResult).isGreaterThan(0);

        var entity = underTest.findById(id).orElseThrow();
        assertThat(entity.getSpaceId()).isEqualTo(expectedSpaceId);
    }

    // @Test
    // void test_update_opened_space_and_list() {
    //     // given  
    //     // when
    //     var actualResult = underTest.findByTeamIdAndUserId(teamId, userId);

    //     // then
    //     assertThat(actualResult).isNotEmpty();
    // }
}
