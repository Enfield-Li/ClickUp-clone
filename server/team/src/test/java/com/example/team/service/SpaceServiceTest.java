package com.example.team.service;

import static com.example.amqp.ExchangeKey.TeamActivityRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.team.TeamServiceConstants.SPACE_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.SPACE_ORDER_INDEX_CONSTRAINT;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.Set;

import javax.persistence.EntityManager;

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

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.model.UserInfo;
import com.example.team.repository.SpaceRepository;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
public class SpaceServiceTest implements WithAssertions {

    SpaceService underTest;

    @Mock
    EntityManager entityManager;

    @Mock
    UserInfoService userInfoService;

    @Mock
    SpaceRepository repository;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

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
                rabbitMQMessageProducer);
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
        var UpdateTeamActivityDTO = new UpdateTeamActivityDTO(
                teamId, spaceId, null, listId);

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

        verify(rabbitMQMessageProducer).publish(
                internalExchange,
                TeamActivityRoutingKey,
                UpdateTeamActivityDTO);
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

        // then
        verify(rabbitMQMessageProducer, never())
                .publish(any(), any(), any());
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

        // then
        verify(rabbitMQMessageProducer, never())
                .publish(any(), any(), any());
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
        verify(rabbitMQMessageProducer, never())
                .publish(any(), any(), any());
    }
}
