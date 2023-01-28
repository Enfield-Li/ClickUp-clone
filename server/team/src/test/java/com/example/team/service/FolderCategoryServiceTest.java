package com.example.team.service;

import com.example.amqp.RabbitMqMessageProducer;
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

import static org.mockito.ArgumentMatchers.any;
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

}
