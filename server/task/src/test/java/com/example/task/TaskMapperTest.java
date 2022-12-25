package com.example.task;

import java.time.LocalDateTime;
import java.util.Set;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.mybatis.spring.boot.test.autoconfigure.AutoConfigureMybatis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.task.model.UserInfo;
import com.example.task.model.Task;
import com.example.task.model.taskPosition.DueDate;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.Priority;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

@DataJpaTest
@Transactional
@AutoConfigureMybatis
public class TaskMapperTest implements WithAssertions {

    @Autowired
    TaskMapper underTest;

    @Autowired
    TaskRepository taskRepository;

    Integer taskId;
    String taskOneTitle = "taskOne";

    String statusTableName = "status_position";
    String dueDateTableName = "due_date_position";
    String priorityTableName = "priority_position";

    @BeforeEach
    void setUp(final TestInfo info) {
        var status = StatusPosition.builder().columnId(1).orderIndex(1).name("IN_PROGRESS").build();
        var priority = PriorityPosition.builder().columnId(1).orderIndex(1).name(Priority.NORMAL).build();
        var dueDate = DueDatePosition.builder().columnId(1).orderIndex(1).name(DueDate.TODAY).build();
        var creator = UserInfo.builder().userId(1).username("user1").build();
        var task = Task.builder().listId(1).title(taskOneTitle).status(status).priority(priority).dueDate(dueDate)
                .creator(creator).watchers(Set.of(creator)).build();

        taskId = taskRepository.save(task).getId();
        taskRepository.findById(taskId).orElseThrow();
    }

    @Test
    void update_task_expected_due_date_should_pass() {
        // given
        var expectedDueDateInput = LocalDateTime.now();

        // when
        var updateCount = underTest.updateExpectedDueDate(
                taskId, expectedDueDateInput);

        // then
        assertThat(updateCount).isGreaterThan(0);
    }

    @Test
    void update_task_position_in_status_should_pass() {
        // given
        var expectedStatusPosition = StatusPosition.builder()
                .columnId(2).name("new status").orderIndex(10).build();

        // when
        var updateCount = underTest.updateTaskPosition(
                taskId, statusTableName, expectedStatusPosition);

        // then
        assertThat(updateCount).isGreaterThan(0);
    }

    @Test
    void update_task_position_in_priority_should_pass() {
        // given
        var expectedPriorityPosition = PriorityPosition.builder()
                .columnId(2).name(Priority.HIGH).orderIndex(10).build();

        // when
        var updateCount = underTest.updateTaskPosition(
                taskId, statusTableName, expectedPriorityPosition);

        // then
        assertThat(updateCount).isGreaterThan(0);
    }

    @Test
    void update_task_position_in_due_date_should_pass() {
        // given
        var expectedDueDatePosition = DueDatePosition.builder()
                .columnId(2).name(DueDate.MONDAY).orderIndex(10).build();

        // when
        var updateCount = underTest.updateTaskPosition(
                taskId, statusTableName, expectedDueDatePosition);

        // then
        assertThat(updateCount).isGreaterThan(0);
    }
}
