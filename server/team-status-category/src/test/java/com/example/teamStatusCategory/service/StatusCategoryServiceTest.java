package com.example.teamStatusCategory.service;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.task.UpdateTaskStatusOnAddingColumnDTO;
import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.teamStatusCategory.dto.AddStatusColumnDTO;
import com.example.teamStatusCategory.dto.AddStatusColumnResponseDTO;
import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import com.example.teamStatusCategory.dto.UpdateStatusCategoryNameDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
import com.example.teamStatusCategory.repository.StatusCategoryRepository;
import com.example.teamStatusCategory.repository.StatusColumnRepository;
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
import java.util.*;
import java.util.stream.Collectors;

import static com.example.amqp.ExchangeKey.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class StatusCategoryServiceTest implements WithAssertions {

    StatusCategoryService underTest;

    @Mock
    StatusCategoryRepository repository;

    @Mock
    EntityManager entityManager;

    @Mock
    StatusColumnRepository statusColumnRepository;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<Integer> integerCaptor;

    @Captor
    ArgumentCaptor<StatusColumn> statusColumnCaptor;

    @Captor
    ArgumentCaptor<StatusCategory> statusCategoryCaptor;

    @Captor
    ArgumentCaptor<List<StatusCategory>> statusCategoriesCaptor;

    @BeforeEach
    void setUp() {
        underTest = new StatusCategoryService(entityManager, repository,
                statusColumnRepository, rabbitMQMessageProducer);
    }

    @Test
    void test_get_status_category_for_team() {
        // given
        var teamId = 5523;
        List<StatusCategory> expectedResult = List.of();
        given(repository.findAllByTeamId(any())).willReturn(expectedResult);

        // when 
        var actualResult = underTest.getStatusCategoryForTeam(teamId);

        // then
        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_init_default_status_category_in_registration() {
        // given
        var teamId = 4543;
        var expectedStatusCategory = StatusCategory.builder().build();
        var statusCategories = List.of(
                new StatusCategory(), expectedStatusCategory);

        given(repository.saveAll(any())).willReturn(statusCategories);

        // when
        var actualResult = underTest
                .initDefaultStatusCategoryInRegistration(teamId);

        // then
        verify(repository).saveAll(statusCategoriesCaptor.capture());
        var capturedValueStatusCategories = statusCategoriesCaptor.getValue();
        assertThat(capturedValueStatusCategories).hasSize(5);
        assertThat(capturedValueStatusCategories).allSatisfy((statusCategory) -> {
            assertThat(statusCategory.getTeamId()).isEqualTo(teamId);
            assertThat(statusCategory.getStatusColumns()).anySatisfy(column -> {
                assertThat(column.getMarkAsClosed()).isTrue();
            });
            assertThat(statusCategory.getStatusColumns()).anySatisfy(column -> {
                assertThat(column.getIsDefaultStatus()).isTrue();
            });
            assertThat(statusCategory.getStatusColumns()).allSatisfy(column -> {
                assertThat(column.getStatusCategory()).isEqualTo(statusCategory);
            });

            assertThat(statusCategory.getTeamId()).isEqualTo(teamId);

            var orderIndexSet = new HashSet<Integer>();
            statusCategory.getStatusColumns()
                    .forEach(column -> orderIndexSet
                            .add(column.getOrderIndex()));
            assertThat(orderIndexSet)
                    .hasSize(statusCategory.getStatusColumns().size());
        });

        assertThat(capturedValueStatusCategories).anySatisfy(category -> {
            assertThat(category.getIsDefaultCategory()).isNotNull();
        });

        var defaultCategorySize = capturedValueStatusCategories.stream()
                .filter(category -> category.getIsDefaultCategory() != null
                        && category.getIsDefaultCategory())
                .collect(Collectors.toList());
        assertThat(defaultCategorySize).hasSize(1);

        assertThat(actualResult).isEqualTo(expectedStatusCategory);
    }

    @Test
    void test_add_status_column_response_dto_when_category_is_a_custom_one() {
        // given
        var listId = 5;
        var orderIndex = 5;
        var categoryId = 66;
        var title = "title";
        var color = "color";
        var statusColumnId = 46;
        var statusColumn = new StatusColumn();
        statusColumn.setId(statusColumnId);
        var dto = new AddStatusColumnDTO(
                title, color, listId, categoryId, orderIndex);
        var originalStatusCategory = new StatusCategory();
        originalStatusCategory.setId(categoryId);
        var expectedResult = new AddStatusColumnResponseDTO(
                categoryId, statusColumnId, null);

        given(repository.findById(any()))
                .willReturn(Optional.of(originalStatusCategory));
        given(statusColumnRepository.save(any())).willReturn(statusColumn);

        // when
        var actualResult = underTest.cloneStatusCategoryForListCategory(dto);

        // then
        verify(statusColumnRepository).save(statusColumnCaptor.capture());
        var capturedStatusColumn = statusColumnCaptor.getValue();
        assertThat(capturedStatusColumn.getStatusCategory())
                .isEqualTo(originalStatusCategory);
        assertThat(originalStatusCategory.getStatusColumns())
                .contains(capturedStatusColumn);
        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_add_status_column_response_dto_for_creating_new_category() {
        // given
        var listId = 5;
        var orderIndex = 5;
        var title = "title";
        var color = "color";
        var originalCategoryId = 66;
        var newStatusColumn = StatusColumn.builder().title(title)
                .color(color).orderIndex(orderIndex).build();
        var dto = new AddStatusColumnDTO(
                title, color, listId, originalCategoryId, orderIndex);

        var teamId = 70;
        var name = "name";
        var originalStatusColumnId = 52;
        var originalStatusColumn = new StatusColumn();
        originalStatusColumn.setId(originalStatusColumnId);
        originalStatusColumn.setTitle(title);

        var originalStatusCategory = new StatusCategory();
        originalStatusCategory.setName(name);
        originalStatusCategory.setId(originalCategoryId);
        originalStatusCategory.setTeamId(teamId);
        originalStatusCategory.addStatusColumn(originalStatusColumn);

        var statusColumnId = 33;
        var statusColumn = new StatusColumn();
        statusColumn.setId(statusColumnId);
        statusColumn.setTitle(title);

        var categoryId = 66;
        var statusCategory = new StatusCategory();
        statusCategory.setId(categoryId);
        statusCategory.addStatusColumn(statusColumn);

        var updateListCategoryDTO = new UpdateListCategoryDefaultStatusCategoryIdDTO(
                listId, categoryId);

        var statusPairs = new HashMap<Integer, Integer>();
        statusPairs.put(originalStatusColumnId, statusColumnId);

        var updateTaskDTO = new UpdateTaskStatusOnAddingColumnDTO(
                listId, statusPairs);

        var expectedResult = new AddStatusColumnResponseDTO(
                statusCategory.getId(), newStatusColumn.getId(), statusPairs);

        given(repository.saveAndFlush(any())).willReturn(statusCategory);
        given(repository.findById(any()))
                .willReturn(Optional.of(originalStatusCategory));

        // when
        var actualResult = underTest.cloneStatusCategoryForListCategory(dto);

        // then
        verify(repository).saveAndFlush(statusCategoryCaptor.capture());
        var capturedStatusCategory = statusCategoryCaptor.getValue();
        assertThat(capturedStatusCategory
                .getStatusColumns()).contains(newStatusColumn);

        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange), eq(teamRoutingKey), eq(updateListCategoryDTO));
        verify(rabbitMQMessageProducer).publish(
                eq(internalExchange), eq(updateTaskStatusOnAddingNewColumnRoutingKey), eq(updateTaskDTO));

        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_get_status_category_for_list_should_pass() {
        // given
        var listId = 5523;
        var expectedResult = StatusCategory.builder().build();
        given(repository.findById(any()))
                .willReturn(Optional.of(expectedResult));

        // when 
        var actualResult = underTest.getStatusCategoryForList(listId);

        // then
        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_get_status_category_for_list_should_fail() {
        // given
        var listId = 5523;
        var errorMessage = String.format(
                "StatusCategory with id: %s not found", listId);
        given(repository.findById(any())).willReturn(Optional.empty());

        // when 
        // then
        assertThatThrownBy(() -> underTest.getStatusCategoryForList(listId))
                .isInstanceOf(InternalErrorException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_create_status_category() {
        // given
        var teamId = 55;
        var name = "some name";
        var statusColumn = new StatusColumn();
        var statusColumns = Set.of(statusColumn);
        var dto = new CreateStatusCategoryDTO(name, teamId, statusColumns);
        var expectedResult = new StatusCategory();

        given(repository.save(any())).willReturn(expectedResult);

        // when 
        var actualResult = underTest.createStatusCategory(dto);

        // then
        verify(repository).save(statusCategoryCaptor.capture());
        var capturedStatusCategoryValue = statusCategoryCaptor.getValue();
        assertThat(capturedStatusCategoryValue.getStatusColumns())
                .isEqualTo(statusColumns);
        assertThat(capturedStatusCategoryValue.getStatusColumns())
                .allSatisfy((column) -> {
                    assertThat(column.getStatusCategory()).isNotNull();
                    assertThat(column.getStatusCategory())
                            .isEqualTo(capturedStatusCategoryValue);
                });

        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_init_default_status_category() {
        // given
        var teamId = 4543;
        var expectedStatusCategoryId = 51;
        var statusCategories = List.of(StatusCategory.builder()
                .id(expectedStatusCategoryId).build());

        given(repository.saveAll(any())).willReturn(statusCategories);

        // when 
        var actualResult = underTest
                .initDefaultStatusCategory(teamId);

        // then
        verify(repository).saveAll(statusCategoriesCaptor.capture());
        var capturedValueStatusCategories = statusCategoriesCaptor.getValue();
        assertThat(capturedValueStatusCategories).hasSize(5);
        assertThat(capturedValueStatusCategories).allSatisfy((statusCategory) -> {
            assertThat(statusCategory.getTeamId()).isEqualTo(teamId);
            assertThat(statusCategory.getStatusColumns()).anySatisfy(column -> {
                assertThat(column.getMarkAsClosed()).isTrue();
            });
            assertThat(statusCategory.getStatusColumns()).anySatisfy(column -> {
                assertThat(column.getIsDefaultStatus()).isTrue();
            });
            assertThat(statusCategory.getStatusColumns()).allSatisfy(column -> {
                assertThat(column.getStatusCategory()).isEqualTo(statusCategory);
            });

            assertThat(statusCategory.getTeamId()).isEqualTo(teamId);

            var orderIndexSet = new HashSet<Integer>();
            statusCategory.getStatusColumns()
                    .forEach(column -> orderIndexSet
                            .add(column.getOrderIndex()));
            assertThat(orderIndexSet)
                    .hasSize(statusCategory.getStatusColumns().size());
        });

        assertThat(capturedValueStatusCategories).anySatisfy(category -> {
            assertThat(category.getIsDefaultCategory()).isNotNull();
        });

        var defaultCategorySize = capturedValueStatusCategories.stream()
                .filter(category -> category.getIsDefaultCategory() != null
                        && category.getIsDefaultCategory())
                .collect(Collectors.toList());
        assertThat(defaultCategorySize).hasSize(1);

        assertThat(actualResult).isEqualTo(expectedStatusCategoryId);
    }

    @Test
    void test_update_status_category_name() {
        // given
        var id = 1123;
        var name = "name";
        var expectedResult = true;
        var dto = new UpdateStatusCategoryNameDTO(id, name);
        var statusCategory = new StatusCategory();

        given(entityManager.getReference(any(), any()))
                .willReturn(statusCategory);

        // when 
        var actualResult = underTest
                .updateStatusCategoryName(dto);

        // then
        assertThat(actualResult).isEqualTo(expectedResult);
    }

    @Test
    void test_delete_status_category() {
        // given
        var id = 41;

        // when 
        var actualResult = underTest.deleteStatusCategory(id);

        // then
        verify(repository).deleteById(integerCaptor.capture());
        assertThat(actualResult).isTrue();
        assertThat(integerCaptor.getValue()).isEqualTo(id);
    }
}
