package com.example.task;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.mybatis.spring.boot.test.autoconfigure.AutoConfigureMybatis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import com.example.task.model.Participant;
import com.example.task.model.Task;
import com.example.task.model.taskPosition.DueDate;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.Priority;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

@DataJpaTest
@AutoConfigureMybatis
@Rollback(value = false)
public class TaskMapperTest implements WithAssertions {

    @Autowired
    TaskMapper underTest;

    @Autowired
    TaskRepository taskRepository;

    String taskOne = "taskOne";

    @BeforeEach
    void setUp(final TestInfo info) {
        // exclude method https://stackoverflow.com/a/69825777/16648127
        Boolean hasData = taskRepository.findAll().size() > 0;
        if (hasData) {
            return;
        }

        var status = StatusPosition.builder().columnId(1).orderIndex(1).name("IN_PROGRESS").build();
        var priority = PriorityPosition.builder().columnId(1).orderIndex(1).name(Priority.NORMAL).build();
        var dueDate = DueDatePosition.builder().columnId(1).orderIndex(1).name(DueDate.TODAY).build();
        var creator = Participant.builder().userId(1).username("user1").build();
        var task = new Task(taskOne, status, priority, dueDate, creator, Set.of(creator));

        taskRepository.save(task);
    }

    @Test
    void update_task_expected_due_date_should_pass2() {
        // // given
        // var taskId = taskRepository.findByTitle(taskOne).orElseThrow().getId();
        // var expectedDueDateInput = LocalDateTime.now();

        // // when
        // var updateCount = taskRepository.updateExpectedDueDate(taskId, expectedDueDateInput);

        // // then
        // assertThat(updateCount).isGreaterThan(0);
        // var task = taskRepository.findById(taskId).orElseThrow();
        // // https://stackoverflow.com/a/38905987/16648127
        // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSSSS");
        // assertThat(task.getExpectedDueDate().format(formatter)).isEqualTo(expectedDueDateInput.format(formatter));
    }

    String statusTableName = "status_position";
    String dueDateTableName = "due_date_position";
    String priorityTableName = "priority_position";

    @Test
    void update_task_position_in_status_should_pass() {
        // given
        // int expectedOrderIndex = 10;

        // // when 
        // var updateCount = underTest.updateTaskPosition(1, statusTableName, 2, expectedOrderIndex);

        // // then
        // var dueDateOrderIndex = taskRepository.findById(1).orElseThrow()
        //         .getDueDate().getOrderIndex();
        // assertThat(updateCount).isGreaterThan(0);
        // assertThat(dueDateOrderIndex).isEqualTo(expectedOrderIndex);
    }

    @Test
    void update_task_position_in_priority_should_pass() {
    }

    @Test
    void update_task_position_in_due_date_should_pass() {
    }
}
