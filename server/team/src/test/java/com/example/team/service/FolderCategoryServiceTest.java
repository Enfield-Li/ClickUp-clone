package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.serviceExceptionHandling.exception.InvalidRequestException;
import com.example.team.dto.CreateFolderDTO;
import com.example.team.model.FolderCategory;
import com.example.team.model.ListCategory;
import com.example.team.model.Space;
import com.example.team.model.UserInfo;
import com.example.team.repository.FolderCategoryRepository;
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
import java.util.List;
import java.util.Set;

import static com.example.amqp.ExchangeKey.deleteTasksRoutingKey;
import static com.example.amqp.ExchangeKey.internalExchange;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class FolderCategoryServiceTest implements WithAssertions {

    FolderCategoryService underTest;

    @Mock
    EntityManager entityManager;

    @Mock
    UserInfoService userInfoService;

    @Mock
    FolderCategoryRepository repository;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<FolderCategory> folderCategoryCaptor;

    UserInfo userInfo = UserInfo.builder()
            .userId(4).username("mockUser").build();

    @BeforeEach
    void setUp() {
        underTest = new FolderCategoryService(
                entityManager,
                userInfoService,
                repository,
                rabbitMQMessageProducer);
    }

    @Test
    void testCreateFolder() {
        // given
        var listId = 15;
        var spaceId = 34;
        var teamId = 456;
        var folderId = 6456;
        var allListNames = List.of("list1");
        var defaultStatusCategoryId = 67;
        var space = Space.builder().teamId(teamId).build();
        var listCategory = ListCategory.builder().id(listId).build();
        var folderCategory = FolderCategory.builder().id(folderId)
                .allLists(Set.of(listCategory)).build();

        var dto = new CreateFolderDTO(
                false, spaceId, "name",
                3, defaultStatusCategoryId, allListNames);

        given(repository.save(any())).willReturn(folderCategory);
        given(userInfoService.getCurrentUserInfo()).willReturn(userInfo);
        given(entityManager.getReference(any(), any())).willReturn(space);

        // when
        var expectedResult = underTest.createFolder(dto);

        // then
        verify(repository).save(folderCategoryCaptor.capture());
        var capturedFolderCategoryValue = folderCategoryCaptor.getValue();
        assertThat(capturedFolderCategoryValue.getCreator())
                .isEqualTo(userInfo);

        assertThat(capturedFolderCategoryValue.getMembers())
                .contains(userInfo);
        assertThat(capturedFolderCategoryValue.getDefaultStatusCategoryId())
                .isEqualTo(defaultStatusCategoryId);

        assertThat(expectedResult).isEqualTo(folderCategory);
    }

    @Test
    void test_delete_folder_should_pass() {
        // given
        var folderId = 1;
        var space = new Space();
        var member = new UserInfo();

        var listId1 = 44;
        var listIds = Set.of(listId1);
        var listCategory1 = ListCategory.builder().id(listId1).build();
        var folderCategory = new FolderCategory();

        folderCategory.addMember(member);
        space.addFolderCategory(folderCategory);
        folderCategory.addListCategory(listCategory1);

        given(repository.existsById(any())).willReturn(true);
        given(entityManager
                .getReference(eq(FolderCategory.class), any()))
                .willReturn(folderCategory);
        given(entityManager.getReference(
                eq(Space.class), any())).willReturn(space);

        // when
        var actualResult = underTest.deleteFolderCategory(folderId);

        // then
        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange),
                eq(deleteTasksRoutingKey),
                eq(listIds));

        verify(entityManager).remove(folderCategoryCaptor.capture());
        var capturedFolderValue = folderCategoryCaptor.getValue();
        assertThat(capturedFolderValue.getMembers()).isEmpty();
        assertThat(capturedFolderValue.getAllLists()).isEmpty();
        assertThat(space.getFolderCategories()).isEmpty();

        assertThat(actualResult).isEqualTo(true);
    }

    @Test
    void test_delete_folder_should_fail() {
        // given
        var folderId = 1;
        var errorMessage = "This folder no longer exists";
        given(repository.existsById(any())).willReturn(false);

        // when
        // then
        assertThatThrownBy(() -> underTest.deleteFolderCategory(folderId))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage(errorMessage);
    }
}
