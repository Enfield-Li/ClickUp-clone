package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.example.amqp.ExchangeKey.deleteTasksRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
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
        var spaceId = 19;
        var listId = 556;
        var folderId = 5;
        var name = "name";
        var orderIndex = 525;
        var defaultStatusCategoryId = 342;
        var folderCategory = new FolderCategory();
        var listCategory = ListCategory.builder().id(listId).build();

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
        given(repository.save(any())).willReturn(listCategory);

        // when
        var actualResult = underTest.createList(dto);

        // then
        verify(repository).save(listCategoryCaptor.capture());
        var capturedListCategoryValue = listCategoryCaptor.getValue();
        assertThat(capturedListCategoryValue.getCreator()).isEqualTo(userInfo);
        assertThat(capturedListCategoryValue.getMembers()).contains(userInfo);
        assertThat(capturedListCategoryValue.getFolderCategory())
                .isEqualTo(folderCategory);
        assertThat(folderCategory.getAllLists())
                .contains(capturedListCategoryValue);

        assertThat(actualResult).isEqualTo(listCategory);
    }

    @Test
    void test_create_list_should_pass_when_adding_list_inside_space() {
        // given
        var spaceId = 19;
        var listId = 556;
        var name = "name";
        var orderIndex = 525;
        var defaultStatusCategoryId = 342;
        var space = Space.builder().build();
        var listCategory = ListCategory.builder().id(listId).build();

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
    }

    @Test
    void test_update_default_status_category_id() {
        // given
        var listCategoryId = 515;
        var statusCategoryId = 6;
        var listCategory = new ListCategory();
        var dto = new UpdateListCategoryDefaultStatusCategoryIdDTO(
                listCategoryId, statusCategoryId);

        given(repository.findById(any())).willReturn(Optional.of(listCategory));

        // when
        underTest.updateDefaultStatusCategoryId(dto);

        // then
        assertThat(listCategory
                .getDefaultStatusCategoryId())
                .isEqualTo(statusCategoryId);

    }

    @Test
    void update_list_should_pass() {
        // Given
        var listId = 1;
        var newColor = "New Color";
        var list = new ListCategory();
        var newListName = "New List Name";

        Map<String, String> params = new HashMap<>();
        params.put("color", newColor);
        params.put("name", newListName);

        given(entityManager.getReference(eq(ListCategory.class), eq(listId)))
                .willReturn(list);

        // When
        Boolean actualResult = underTest.updateList(listId, params);

        // Then
        assertThat(actualResult).isTrue();
        assertThat(list.getColor()).isEqualTo(newColor);
        assertThat(list.getName()).isEqualTo(newListName);
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

    @Test
    void test_delete_folder_should_pass_when_list_inside_folder() {
        // given
        var listId = 3;
        var folderId = 14;
        var space = new Space();
        var member = new UserInfo();
        var listCategory = new ListCategory();
        var folderCategory = new FolderCategory();

        listCategory.setId(listId);
        listCategory.addMember(member);
        listCategory.setParentFolderId(folderId);
        folderCategory.setId(folderId);
        folderCategory.addListCategory(listCategory);

        given(repository.existsById(any())).willReturn(true);
        given(entityManager
                .getReference(eq(ListCategory.class), any()))
                .willReturn(listCategory);
        given(entityManager
                .getReference(eq(FolderCategory.class), any()))
                .willReturn(folderCategory);

        // when
        var actualResult = underTest.deleteListCategory(listId);

        // then
        verify(entityManager).remove(listCategoryCaptor.capture());
        var capturedListValue = listCategoryCaptor.getValue();
        assertThat(capturedListValue).isEqualTo(listCategory);
        assertThat(capturedListValue.getMembers()).isEmpty();

        assertThat(actualResult).isTrue();
        assertThat(folderCategory.getAllLists()).doesNotContain(listCategory);
        verify(entityManager, never()).getReference(eq(Space.class), any());
    }

    @Test
    void test_delete_folder_should_pass_when_list_inside_space() {
        // given
        var listId = 3;
        var spaceId = 14;
        var space = new Space();
        var member = new UserInfo();
        var listCategory = new ListCategory();

        listCategory.setId(listId);
        listCategory.addMember(member);
        listCategory.setSpaceId(spaceId);
        space.setId(spaceId);
        space.addListCategory(listCategory);

        given(repository.existsById(any())).willReturn(true);
        given(entityManager
                .getReference(eq(ListCategory.class), any()))
                .willReturn(listCategory);
        given(entityManager.getReference(
                eq(Space.class), any())).willReturn(space);

        // when
        var actualResult = underTest.deleteListCategory(listId);

        // then
        rabbitMQMessageProducer.publish(
                eq(internalExchange),
                eq(deleteTasksRoutingKey),
                eq(List.of(listId)));

        verify(entityManager).remove(listCategoryCaptor.capture());
        var capturedListValue = listCategoryCaptor.getValue();
        assertThat(capturedListValue).isEqualTo(listCategory);
        assertThat(capturedListValue.getMembers()).isEmpty();

        assertThat(actualResult).isTrue();
        assertThat(space.getListCategories()).doesNotContain(listCategory);
        verify(entityManager, never())
                .getReference(eq(FolderCategory.class), any());
    }

    @Test
    void test_delete_folder_should_fail() {
        // given
        var listId = 1;
        var errorMessage = "This list no longer exists";
        given(repository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.deleteListCategory(listId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }

}
