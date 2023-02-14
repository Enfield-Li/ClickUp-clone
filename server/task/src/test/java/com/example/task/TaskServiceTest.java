package com.example.task;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.statusCategory.StatusCategoryClient;
import com.example.task.model.Task;
import com.example.task.model.UserInfo;
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

    UserInfo creator = UserInfo.builder().userId(1).username("user1").build();

    @BeforeEach
    void setUp() {
        underTest = new TaskService(taskMapper, repository, entityManager,
                userInfoService, statusCategoryClient, rabbitMQMessageProducer);
    }

    @Test
    void create_Task_should_pass() {
        // given
        // when
        // then

    }

    @Test
    void get_all_tasks() {
        // given
        // when
        // then
    }

    @Test
    void create_task() {
        // given
        // when
        // then
    }

    @Test
    void update_tasks_position() {
        // given
        // when
        // then
    }

    @Test
    void update_task_title() {
        // given
        // when
        // then
    }

    @Test
    void update_task_desc() {
        // given
        // when
        // then
    }

    @Test
    void update_task_status_on_adding_new_column() {
        // given
        // when
        // then
    }

    @Test
    void delete_tasks_by_list_id() {
        // given
        // when
        // then
    }

    @Test
    void delete_task() {
        // given
        // when
        // then
    }

    @Test
    void init_tasks_in_registration() {
        // given
        // when
        // then
    }
}
