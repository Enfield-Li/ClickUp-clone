package com.example.teamStatusCategory.service;

import com.example.clients.jwt.UserCredentials;
import com.example.serviceExceptionHandling.exception.InternalErrorException;
import com.example.teamStatusCategory.dto.CreateStatusColumnDTO;
import com.example.teamStatusCategory.dto.UpdateStatusColumnDTO;
import com.example.teamStatusCategory.model.StatusCategory;
import com.example.teamStatusCategory.model.StatusColumn;
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
import javax.persistence.EntityNotFoundException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
public class StatusColumnServiceTest implements WithAssertions {

    StatusColumnService underTest;

    @Mock
    StatusColumnRepository repository;

    @Mock
    EntityManager entityManager;

    @Captor
    ArgumentCaptor<StatusColumn> statusColumnCaptor;

    @Captor
    ArgumentCaptor<Integer> integerCaptor;

    UserCredentials userCredentials = new UserCredentials(1, "mockUser");

    @BeforeEach
    void setUp() {
        underTest = new StatusColumnService(entityManager, repository);
    }

    @Test
    void test_create_status_column_for_category_should_pass() {
        // given
        var title = "title";
        var color = "color";
        var expectedId = 55;
        var orderIndex = 141;
        var categoryId = 15453;
        var statusColumn = StatusColumn.builder()
                .id(expectedId).build();

        var dto = new CreateStatusColumnDTO(
                title, color, categoryId, orderIndex);
        var statusCategory = new StatusCategory();

        given(repository.save(any())).willReturn(statusColumn);
        given(entityManager.getReference(any(), any()))
                .willReturn(statusCategory);

        // when
        var actualResult = underTest
                .createStatusColumn(dto);

        // then
        verify(repository).save(statusColumnCaptor.capture());
        var capturedStatusColumnValue = statusColumnCaptor.getValue();
        assertThat(statusCategory.getStatusColumns())
                .hasSize(1).contains(capturedStatusColumnValue);
        assertThat(capturedStatusColumnValue.getStatusCategory())
                .isEqualTo(statusCategory);
        assertThat(actualResult).isEqualTo(expectedId);
    }

    @Test
    void test_create_status_column_for_category_should_fail() {
        // given
        var title = "title";
        var color = "color";
        var orderIndex = 141;
        var categoryId = 15453;
        var errorMessage = String
                .format("StatusCategory with id: %s not found", categoryId);

        var dto = new CreateStatusColumnDTO(
                title, color, categoryId, orderIndex);

        given(entityManager.getReference(any(), any()))
                .willThrow(EntityNotFoundException.class);

        // when
        // then
        assertThatThrownBy(() -> underTest
                .createStatusColumn(dto))
                .isInstanceOf(InternalErrorException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_update_status_column_should_pass() {
        // given
        var id = 15453;
        var title = "title";
        var color = "color";
        var orderIndex = 141;
        var dto = new UpdateStatusColumnDTO(
                id, title, color, orderIndex);
        var errorMessage = String
                .format("StatusColumn with id: %s not found", id);
        given(entityManager.getReference(any(), any()))
                .willThrow(EntityNotFoundException.class);

        // when
        // then
        assertThatThrownBy(() -> underTest
                .updateStatusColumn(dto))
                .isInstanceOf(InternalErrorException.class)
                .hasMessage(errorMessage);
    }

    @Test
    void test_update_status_column_should_fail() {
        // given
        var id = 15453;
        var title = "title";
        var color = "color";
        var orderIndex = 141;
        var dto = new UpdateStatusColumnDTO(
                id, title, color, orderIndex);
        var statusColumn = new StatusColumn();

        given(entityManager.getReference(any(), any()))
                .willReturn(statusColumn);

        // when
        var expectedResult = underTest.updateStatusColumn(dto);

        // then
        assertThat(expectedResult).isTrue();
        assertThat(statusColumn.getTitle()).isEqualTo(title);
        assertThat(statusColumn.getColor()).isEqualTo(color);
        assertThat(statusColumn.getOrderIndex()).isEqualTo(orderIndex);
    }

    @Test
    void test_delete_status_column_should_pass() {
        // given
        var id = 51;
        var rowsAffected = 1;

        given(repository.deleteStatusColumnById(any()))
                .willReturn(rowsAffected);

        // when
        var actualResult = underTest.deleteStatusColumn(id);

        // then
        verify(repository).deleteStatusColumnById(
                integerCaptor.capture());
        assertThat(integerCaptor.getValue()).isEqualTo(id);
        assertThat(actualResult).isEqualTo(true);
    }

    @Test
    void test_delete_status_column_should_fail() {
        // given
        var id = 51;
        var rowsAffected = 0;
        var errorMessage = String
                .format("Failed to delete StatusColumn with id: %s", id);

        given(repository.deleteStatusColumnById(any()))
                .willReturn(rowsAffected);

        // when
        // then
        assertThatThrownBy(() -> underTest.deleteStatusColumn(id))
                .isInstanceOf(InternalErrorException.class)
                .hasMessage(errorMessage);
        verify(repository).deleteStatusColumnById(
                integerCaptor.capture());
        assertThat(integerCaptor.getValue()).isEqualTo(id);
    }

}
