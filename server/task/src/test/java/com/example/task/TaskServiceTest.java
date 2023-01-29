package com.example.task;

import com.example.task.model.Task;
import com.example.task.model.UserInfo;
import com.example.task.repository.TaskMapper;
import com.example.task.repository.TaskRepository;
import com.example.task.service.TaskService;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest implements WithAssertions {

    TaskService underTest;

    @Mock
    TaskMapper taskMapper;

    @Mock
    TaskRepository taskRepository;

    // @Mock
    // RabbitMqMessageProducer rabbitMQMessageProducer;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Captor
    ArgumentCaptor<Task> taskArgCaptor;

    UserInfo creator = UserInfo.builder().userId(1).username("user1").build();

    @BeforeEach
    void setUp() {
        // underTest = new TaskService(taskMapper, taskRepository);
        // SecurityContextHolder.setContext(securityContext);
        // given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        // given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(creator);
    }

    @Test
    void create_Task_should_pass() {
        // given
        // when
        // then

    }

    // @Test
    // void testDeleteTask() {
    //     // given
    //     // when
    //     // then
    // }

    // @Test
    // void testGetAllTasks() {
    //     // given
    //     // when
    //     // then
    // }

    // @Test
    // void testUpdateTaskDesc() {
    // }

    // @Test
    // void testUpdateTaskTitle() {
    //     // given
    //     // when
    //     // then
    // }

    // @Test
    // void testUpdateTasksPosition() {
    //     // given
    //     // when
    //     // then
    // }
}
