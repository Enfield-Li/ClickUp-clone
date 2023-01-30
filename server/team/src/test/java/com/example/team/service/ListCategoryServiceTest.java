package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateListDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.model.UserInfo;
import com.example.team.repository.ListCategoryRepository;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.OutputCaptureExtension;

import javax.persistence.EntityManager;

import static com.example.amqp.ExchangeKey.internalExchange;
import static com.example.amqp.ExchangeKey.teamActivityRoutingKey;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class ListCategoryServiceTest implements WithAssertions {

    ListCategoryService underTest;

    @Mock
    EntityManager entityManager;

    @Mock
    UserInfoService userInfoService;

    @Mock
    ListCategoryRepository repository;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<ListCategory> listCategoryCaptor;

    UserInfo userInfo = UserInfo.builder()
            .userId(4).username("mockUser").build();

    @BeforeEach
    void setUp() {
        underTest = new ListCategoryService(
                entityManager,
                userInfoService,
                repository,
                rabbitMQMessageProducer);
    }

    @Test
    void test_create_list_should_pass_when_adding_list_inside_folder() {
        // given
        var teamId = 15;
        var spaceId = 19;
        var listId = 556;
        var folderId = 5;
        var name = "name";
        var orderIndex = 525;
        var defaultStatusCategoryId = 342;
        var folderCategory = new FolderCategory();
        var space = Space.builder().teamId(teamId).build();
        var listCategory = ListCategory.builder().id(listId).build();
        var UpdateTeamActivityDTO = new UpdateTeamActivityDTO(
                teamId, spaceId, folderId, listId, null);

        var dto = new CreateListDTO(
                folderId, spaceId, name, orderIndex, defaultStatusCategoryId);

        given(repository
                .existsByNameAndSpaceIdAndParentFolderId(
                        any(), any(), any()))
                .willReturn(false);
        given(userInfoService.getCurrentUserInfo())
                .willReturn(userInfo);
        given(entityManager.getReference(
                eq(FolderCategory.class), any())).willReturn(folderCategory);
        given(entityManager.getReference(
                eq(Space.class), any())).willReturn(space);
        given(repository.save(any())).willReturn(listCategory);

        // when
        var actualResult = underTest.createList(dto);

        // then
        verify(repository).save(listCategoryCaptor.capture());
        var capturedListCategoryValue = listCategoryCaptor.getValue();
        assertThat(capturedListCategoryValue.getSpace()).isEqualTo(space);
        assertThat(capturedListCategoryValue.getCreator()).isEqualTo(userInfo);
        assertThat(capturedListCategoryValue.getMembers()).contains(userInfo);
        assertThat(capturedListCategoryValue.getFolderCategory())
                .isEqualTo(folderCategory);
        assertThat(space.getListCategories())
                .contains(capturedListCategoryValue);
        assertThat(folderCategory.getAllLists())
                .contains(capturedListCategoryValue);

        assertThat(actualResult).isEqualTo(listCategory);
        verify(rabbitMQMessageProducer).publish(
                internalExchange,
                teamActivityRoutingKey,
                UpdateTeamActivityDTO);
    }

    @Test
    void test_create_list_should_pass_when_adding_list_inside_space() {
        // given
        var teamId = 15;
        var spaceId = 19;
        var listId = 556;
        var name = "name";
        var orderIndex = 525;
        var defaultStatusCategoryId = 342;
        var space = Space.builder().teamId(teamId).build();
        var listCategory = ListCategory.builder().id(listId).build();
        var UpdateTeamActivityDTO = new UpdateTeamActivityDTO(
                teamId, spaceId, null, listId, null);

        var dto = new CreateListDTO(
                null, spaceId, name, orderIndex, defaultStatusCategoryId);

        given(repository
                .existsByNameAndSpaceIdAndParentFolderId(
                        any(), any(), any()))
                .willReturn(false);
        given(userInfoService.getCurrentUserInfo())
                .willReturn(userInfo);
        given(entityManager.getReference(
                eq(Space.class), any())).willReturn(space);
        given(repository.save(any())).willReturn(listCategory);

        // when
        var actualResult = underTest.createList(dto);

        // then
        verify(repository).save(listCategoryCaptor.capture());
        var capturedListCategoryValue = listCategoryCaptor.getValue();
        assertThat(capturedListCategoryValue.getSpace()).isEqualTo(space);
        assertThat(capturedListCategoryValue.getCreator()).isEqualTo(userInfo);
        assertThat(capturedListCategoryValue.getMembers()).contains(userInfo);
        assertThat(space.getListCategories())
                .contains(capturedListCategoryValue);

        assertThat(actualResult).isEqualTo(listCategory);
        verify(rabbitMQMessageProducer).publish(
                internalExchange,
                teamActivityRoutingKey,
                UpdateTeamActivityDTO);
    }

    @Test
    void test_create_list_should_fail() {
        // given
        var spaceId = 19;
        var name = "name";
        var orderIndex = 525;
        var defaultStatusCategoryId = 342;
        var errorMessage = "List name taken";

        var dto = new CreateListDTO(
                null, spaceId, name, orderIndex, defaultStatusCategoryId);

        given(repository
                .existsByNameAndSpaceIdAndParentFolderId(
                        any(), any(), any()))
                .willReturn(true);

        // when
        // then
        assertThatThrownBy(() -> underTest
                .createList(dto))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);

    }
}
