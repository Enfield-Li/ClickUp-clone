package com.example.task;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.Participant;
import com.example.task.model.Task;
import com.example.task.model.taskPosition.Priority;
import com.example.task.model.taskPosition.TaskDueDatePosition;
import com.example.task.model.taskPosition.TaskPriorityPosition;
import com.example.task.model.taskPosition.TaskStatusPosition;
import java.util.Date;
import java.util.Set;
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
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest implements WithAssertions {

    TaskService underTest;

    @Mock
    TaskRepository taskRepository;

    @Mock
    RabbitMqMessageProducer rabbitMQMessageProducer;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Captor
    ArgumentCaptor<Task> taskArgCaptor;

    Participant creator = Participant.builder().userId(1).username("user1").build();

    @BeforeEach
    void setUp() {
        underTest = new TaskService(taskRepository, rabbitMQMessageProducer);
        SecurityContextHolder.setContext(securityContext);
        given(SecurityContextHolder.getContext().getAuthentication()).willReturn(authentication);
        given(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).willReturn(creator);
    }

    @Test
    void create_Task_should_pass() {
        // given
        var status = TaskStatusPosition.builder().columnId(1).orderIndex(1).name("IN_PROGRESS").build();
        var priority = TaskPriorityPosition.builder().columnId(1).orderIndex(1).name(Priority.NORMAL).build();
        var dueDate = TaskDueDatePosition.builder().columnId(1).orderIndex(1).name("TODAY").build();
        var createTaskDto = new CreateTaskDTO("desc", new Date(), "title", status, dueDate, priority);

        given(taskRepository.save(any())).willReturn(new Task());

        // when
        var actualTask = underTest.createTask(createTaskDto);

        // then
        verify(taskRepository).save(taskArgCaptor.capture());
        var taskCaptured = taskArgCaptor.getValue();

        assertThat(actualTask).isEqualTo(new Task());
        assertThat(taskCaptured.getCreator()).isEqualTo(creator);
        assertThat(taskCaptured.getWatchers()).isEqualTo(Set.of(creator));
        assertThat(taskCaptured.getWatchers())
            .allSatisfy(participant -> {
                assertThat(participant.getTaskWatcher()).isEqualTo(taskCaptured);
            });
    }

    @Test
    void testDeleteTask() {
        // given
        // when
        // then
    }

    @Test
    void testGetAllTasks() {
        // given
        // when
        // then
    }

    @Test
    void testUpdateTaskDesc() {}

    @Test
    void testUpdateTaskTitle() {
        // given
        // when
        // then
    }

    @Test
    void testUpdateTasksPosition() {
        // given
        // when
        // then
    }
}
