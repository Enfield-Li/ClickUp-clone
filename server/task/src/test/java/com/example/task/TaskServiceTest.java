package com.example.task;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.clients.statusCategory.StatusCategoryDTO;
import com.example.clients.task.UpdateTaskStatusOnAddingColumnDTO;
import com.example.task.dto.*;
import com.example.task.model.Task;
import com.example.task.model.UserInfo;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;
import com.example.task.repository.TaskMapper;
import com.example.task.repository.TaskRepository;
import com.example.task.service.TaskService;
import com.example.task.service.UserInfoService;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest implements WithAssertions {

    TaskService underTest;

    @Mock
    TaskMapper taskMapper;

    @Mock
    TaskRepository repository;

    @Mock
    EntityManager entityManager;

    @Mock
    UserInfoService userInfoService;

    @Mock
    StatusCategoryClient statusCategoryClient;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Captor
    ArgumentCaptor<Task> taskArgCaptor;

    @BeforeEach
    void setUp() {
        underTest = new TaskService(taskMapper, repository, entityManager,
                userInfoService, statusCategoryClient, rabbitMQMessageProducer);
    }

    @Test
    void test_get_all_tasks_should_pass() {
        // given
        var listId = 34;
        var defaultStatusCategoryId = 4;
        var taskList = List.of(new Task());
        var statusCategoryDTO = new StatusCategoryDTO(
                2, "name", 4, List.of());
        var expectedResponse = new TaskListStatusCategoryDTO(
                statusCategoryDTO, taskList);

        given(statusCategoryClient.getStatusCategoryForList(any()))
                .willReturn(statusCategoryDTO);
        given(repository.findByListId(any())).willReturn(taskList);

        // when
        var actualResponse = underTest.getAllTasks(
                listId, defaultStatusCategoryId);

        // then
        assertThat(actualResponse).isEqualTo(expectedResponse);
    }

    @Test
    void test_create_task_should_pass() {
        // given
        UserInfo creator = new UserInfo();
        var createTaskDTO = new CreateTaskDTO(
                "desc", LocalDateTime.now(),
                "title", 4,
                new StatusPosition(), new PriorityPosition());
        var expectedResponse = new Task();

        given(userInfoService.getCurrentUserInfo()).willReturn(creator);
        given(repository.save(any())).willReturn(expectedResponse);

        // when
        var actualResponse = underTest.createTask(createTaskDTO);

        // then
        verify(repository).save(taskArgCaptor.capture());
        var taskArg = taskArgCaptor.getValue();
        assertThat(creator.getTasks()).contains(taskArg);
        assertThat(taskArg.getCreator()).isEqualTo(creator);

        assertThat(actualResponse).isEqualTo(expectedResponse);
    }

    @Test
    void update_tasks_position_for_priority() {
        // given
        var statusTableName = "status_position";
        var priorityTableName = "priority_position";

        var sourceTaskId = 5;
        var priorityPositionId = 2;
        var newPriorityPosition = new PriorityPosition();
        newPriorityPosition.setId(priorityPositionId);
        var taskPositionDTO = new TaskPositionDTO(
                1, null, newPriorityPosition,
                null, null);

        var updateTaskPositionDTO = new UpdateTasksPositionDTO(
                sourceTaskId, List.of(taskPositionDTO));

        // when
        var actualResult = underTest.updateTasksPosition(
                updateTaskPositionDTO);

        // then
        verify(taskMapper, times(1))
                .updateTaskPosition(
                        eq(priorityPositionId),
                        eq(priorityTableName),
                        eq(newPriorityPosition));
        verify(taskMapper, never()).updateExpectedDueDate(any(), any());

        assertThat(actualResult).isTrue();
    }

    @Test
    void update_tasks_position_for_status() {
        // given
        var statusTableName = "status_position";
        var priorityTableName = "priority_position";

        var sourceTaskId = 5;
        var statusPositionId = 2;
        var newStatusPosition = new StatusPosition();
        newStatusPosition.setId(statusPositionId);
        var taskPositionDTO = new TaskPositionDTO(
                1, newStatusPosition, null,
                null, null);

        var updateTaskPositionDTO = new UpdateTasksPositionDTO(
                sourceTaskId, List.of(taskPositionDTO));

        // when
        var actualResult = underTest.updateTasksPosition(
                updateTaskPositionDTO);

        // then
        verify(taskMapper, times(1))
                .updateTaskPosition(
                        eq(statusPositionId),
                        eq(statusTableName),
                        eq(newStatusPosition));
        verify(taskMapper, never()).updateExpectedDueDate(any(), any());

        assertThat(actualResult).isTrue();
    }

    @Test
    void update_tasks_position_for_expectedDueDate() {
        // given
        var sourceTaskId = 5;
        var statusPositionId = 2;
        var newExpectedDueDate = LocalDateTime.now();
        var taskPositionDTO = new TaskPositionDTO(
                statusPositionId, null, null,
                newExpectedDueDate, null);

        var updateTaskPositionDTO = new UpdateTasksPositionDTO(
                sourceTaskId, List.of(taskPositionDTO));

        // when
        var actualResult = underTest.updateTasksPosition(
                updateTaskPositionDTO);

        // then
        verify(taskMapper).updateExpectedDueDate(
                eq(statusPositionId), eq(newExpectedDueDate));
        verify(taskMapper, never()).updateTaskPosition(any(), any(), any());

        assertThat(actualResult).isTrue();
    }

    @Test
    void update_task_title() {
        // given
        var taskId = 7;
        var newTitle = "new Title";
        UserInfo creator = new UserInfo();
        var updateTaskTitleDTO = new UpdateTaskTitleDTO(taskId, newTitle);

        given(userInfoService.getCurrentUserInfo()).willReturn(creator);
        given(repository.updateTitle(any(), any(), any())).willReturn(1);

        // when
        var actualResult = underTest.updateTaskTitle(updateTaskTitleDTO);

        // then
        verify(repository).updateTitle(eq(taskId), eq(newTitle), any());

        assertThat(actualResult).isTrue();
    }

    @Test
    void update_task_desc() {
        // given
        var taskId = 7;
        var newDesc = "new desc";
        var updateTaskDescDTO = new UpdateTaskDescDTO(taskId, newDesc);

        given(repository.updateDesc(any(), any(), any())).willReturn(1);

        // when
        var actualResult = underTest.updateTaskDesc(updateTaskDescDTO);

        // then
        verify(repository).updateDesc(eq(taskId), eq(newDesc), any());

        assertThat(actualResult).isTrue();

    }

    @Test
    void update_task_status_on_adding_new_column_should_pass() {
        // given
        var listId = 4;
        var oldColumnIdKey = 66;
        var newColumnIdKey = 72;

        var status = new StatusPosition();
        status.setColumnId(oldColumnIdKey);

        var task = Task.builder().status(status).build();

        var oldNewStatusPairs = new HashMap<Integer, Integer>();
        oldNewStatusPairs.put(oldColumnIdKey, newColumnIdKey);

        var dto = new UpdateTaskStatusOnAddingColumnDTO(
                listId, oldNewStatusPairs);

        given(repository.findByListId(any())).willReturn(List.of(task));

        // when
        underTest.updateTaskStatusOnAddingNewColumn(dto);

        // then
        verify(repository).findByListId(eq(listId));
        assertThat(task.getStatus().getColumnId()).isEqualTo(newColumnIdKey);
    }

    @Test
    void delete_tasks_by_list_id() {
        // given
        var taskId = 4;
        var listIds = Set.of(1);
        var taskIdsProjection = List.of(new TaskIdProjection(taskId));

        var task = new Task();
        var creator = new UserInfo();
        creator.addTask(task);

        given(repository.findByListIdIn(listIds))
                .willReturn(taskIdsProjection);
        given(entityManager.getReference(eq(Task.class), any()))
                .willReturn(task);
        given(entityManager.getReference(eq(UserInfo.class), any()))
                .willReturn(creator);

        // when
        underTest.deleteTasksByListId(listIds);

        // then
        verify(entityManager).remove(eq(task));
        assertThat(task.getCreator()).isNull();
    }

    @Test
    void delete_task() {
        // given
        var task = new Task();
        var creator = new UserInfo();
        creator.addTask(task);

        given(entityManager.getReference(eq(Task.class), any()))
                .willReturn(task);
        given(entityManager.getReference(eq(UserInfo.class), any()))
                .willReturn(creator);

        // when
        underTest.deleteTask(1);

        // then
        verify(entityManager).remove(eq(task));
        assertThat(task.getCreator()).isNull();
    }

    @Test
    void init_tasks_in_registration() {
        // given
        // when
        // then
    }
}
