package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.*;
import com.example.team.repository.SpaceRepository;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.dao.DataIntegrityViolationException;

import javax.persistence.EntityManager;
import java.util.Set;

import static com.example.amqp.ExchangeKey.deleteTasksRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.team.TeamServiceConstants.SPACE_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.SPACE_ORDER_INDEX_CONSTRAINT;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class SpaceServiceTest implements WithAssertions {

    SpaceService underTest;

    @Mock
    EntityManager entityManager;

    @Mock
    UserInfoService userInfoService;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Mock
    SpaceRepository repository;

    @Captor
    ArgumentCaptor<Space> spaceCaptor;

    UserInfo userInfo = UserInfo.builder()
            .userId(4).username("mockUser").build();

    @BeforeEach
    void setUp() {
        underTest = new SpaceService(
                repository,
                entityManager,
                userInfoService,
                rabbitMQMessageProducer
        );
    }

    @Test
    void test_create_space_should_pass() {
        // given
        var teamId = 13;
        var listId = 54;
        var spaceId = 5123;
        var team = new Team();
        var listName = "list";
        var defaultStatusCategoryId = 2345;
        var list = ListCategory.builder().id(listId).build();
        var space = Space.builder().id(spaceId)
                .listCategories(Set.of(list)).build();
        var dto = new CreateSpaceDTO(
                "color", "avatar", false, teamId,
                "spaceName", 2, defaultStatusCategoryId);

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(entityManager.getReference(any(), any())).willReturn(team);
        given(repository.save(any())).willReturn(space);

        // when
        var actualResult = underTest.createSpace(dto);

        // then
        verify(repository).save(spaceCaptor.capture());
        var capturedSpaceValue = spaceCaptor.getValue();
        assertThat(capturedSpaceValue.getListCategories())
                .hasSize(1).allSatisfy(listCategory -> {
                    assertThat(listCategory.getName()).isEqualTo(listName);
                    assertThat(listCategory.getCreator()).isEqualTo(userInfo);
                    assertThat(listCategory.getDefaultStatusCategoryId())
                            .isEqualTo(defaultStatusCategoryId);
                    assertThat(listCategory.getSpace())
                            .isEqualTo(capturedSpaceValue);
                    assertThat(listCategory.getMembers())
                            .hasSize(1).contains(userInfo);
                });

        assertThat(capturedSpaceValue.getDefaultStatusCategoryId())
                .isEqualTo(defaultStatusCategoryId);
        assertThat(capturedSpaceValue.getTeamId()).isEqualTo(teamId);
        assertThat(capturedSpaceValue.getMembers()).contains(userInfo);

        assertThat(team.getSpaces()).contains(capturedSpaceValue);
        assertThat(actualResult).isEqualTo(space);
    }

    @Test
    void test_create_space_should_fail_for_space_name_constraint_violation() {
        // given
        var teamId = 13;
        var team = new Team();
        var defaultStatusCategoryId = 2345;
        var dto = new CreateSpaceDTO(
                "color", "avatar", false, teamId,
                "spaceName", 2, defaultStatusCategoryId);
        var errorMessage = "Space name already exists!";

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(entityManager.getReference(any(), any())).willReturn(team);
        given(repository.save(any()))
                .willThrow(new DataIntegrityViolationException(SPACE_NAME_CONSTRAINT));

        // when
        assertThatThrownBy(() -> underTest
                .createSpace(dto))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_create_space_should_fail_for_space_orderIndex_constraint_violation() {
        // given
        var teamId = 13;
        var team = new Team();
        var defaultStatusCategoryId = 2345;
        var dto = new CreateSpaceDTO(
                "color", "avatar", false, teamId,
                "spaceName", 2, defaultStatusCategoryId);
        var errorMessage = "Space orderIndex already exists!";

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(entityManager.getReference(any(), any())).willReturn(team);
        given(repository.save(any()))
                .willThrow(new DataIntegrityViolationException(SPACE_ORDER_INDEX_CONSTRAINT));

        // when
        assertThatThrownBy(() -> underTest
                .createSpace(dto))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_create_space_should_fail_for_unspecified_space_constraint_violation(
            CapturedOutput output) {
        // given
        var teamId = 13;
        var team = new Team();
        var defaultStatusCategoryId = 2345;
        var dto = new CreateSpaceDTO(
                "color", "avatar", false, teamId,
                "spaceName", 2, defaultStatusCategoryId);
        var errorMessage = "UnSpecified Space constraint violation";

        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(entityManager.getReference(any(), any())).willReturn(team);
        given(repository.save(any()))
                .willThrow(new DataIntegrityViolationException(""));

        // when
        assertThatThrownBy(() -> underTest
                .createSpace(dto))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);

        // then
        assertThat(output).contains(errorMessage);
    }

    @Test
    void test_delete_space_should_pass() {
        // given
        var spaceId = 3;
        var team = new Team();
        var member = new UserInfo();

        var listId1 = 44;
        var listId2 = 45;
        var listIds = Set.of(listId1, listId2);

        var listCategory1 = ListCategory.builder().id(listId1).build();
        var listCategory2 = ListCategory.builder().id(listId2).build();
        var folderCategory = FolderCategory.builder().build();
        var space = Space.builder().id(spaceId).build();

        team.addSpace(space);
        space.addMember(member);
        space.addListCategory(listCategory1);
        space.addFolderCategory(folderCategory);
        folderCategory.addListCategory(listCategory2);

        given(repository.existsById(any())).willReturn(true);
        given(entityManager.getReference(eq(Team.class), any())).willReturn(team);
        given(entityManager.getReference(eq(Space.class), any()))
                .willReturn(space);

        // when
        var actualResult = underTest.deleteSpace(spaceId);

        // then
        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange),
                eq(deleteTasksRoutingKey),
                eq(listIds));

        verify(entityManager).remove(spaceCaptor.capture());
        var capturedSpaceValue = spaceCaptor.getValue();
        assertThat(capturedSpaceValue.getMembers()).isEmpty();
        assertThat(capturedSpaceValue.getListCategories()).isEmpty();
        assertThat(capturedSpaceValue.getFolderCategories()).isEmpty();
        assertThat(folderCategory.getAllLists()).isEmpty();

        assertThat(team.getSpaces()).doesNotContain(capturedSpaceValue);
        assertThat(actualResult).isEqualTo(true);
    }

    @Test
    void test_delete_space_should_fail() {
        // given
        var spaceId = 1;
        var errorMessage = "This space no longer exists";
        given(repository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.deleteSpace(spaceId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }
}
