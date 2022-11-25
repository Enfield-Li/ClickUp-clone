package com.example.task;

import com.example.task.model.Participant;
import com.example.task.model.Task;
import com.example.task.model.taskPosition.DueDate;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.Priority;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest
@Rollback(value = false)
public class TaskRepositoryTest implements WithAssertions {

    @Autowired
    TaskRepository underTest;

    String taskOneTitle = "taskOne";
    String taskTwoTitle = "taskTwo";

    @BeforeEach
    void setUp() {
        Boolean hasData = underTest.findAll().size() > 0;
        if (hasData) {
            return;
        }

        var status = StatusPosition.builder().columnId(1).orderIndex(1).name("IN_PROGRESS").build();
        var priority = PriorityPosition.builder().columnId(1).orderIndex(1).name(Priority.NORMAL).build();
        var dueDate = DueDatePosition.builder().columnId(1).orderIndex(1).name(DueDate.TODAY).build();
        var creator = Participant.builder().userId(1).username("user1").build();

        var task1 = new Task(taskOneTitle, status, priority, dueDate, creator, Set.of(creator));
        var task2 = new Task(taskTwoTitle, status, priority, dueDate, creator, Set.of(creator));
        underTest.saveAll(List.of(task1, task2));
    }

    @Test
    void get_task_title_should_pass() {
        var taskTitle = underTest.getTaskTitle(1);
        assertThat(taskTitle).isEqualTo(taskOneTitle);
    }

    @Test
    @Transactional
    void update_task_desc_should_pass() {
        var taskId = 2;
        var expectedNewDescStr = "newDesc";
        var expectedUpdatedDate = LocalDateTime.now();

        var updateCount = underTest.updateDesc(taskId, expectedNewDescStr, expectedUpdatedDate);
        var updatedTask1 = underTest.findById(taskId).orElseThrow();

        assertThat(updateCount).isGreaterThan(0);
        assertThat(updatedTask1.getDescription()).isEqualTo(expectedNewDescStr);
        // https://stackoverflow.com/a/38905987/16648127
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSSSS");
        assertThat(updatedTask1.getUpdatedAt().format(formatter)).isEqualTo(expectedUpdatedDate.format(formatter));
    }

    @Test
    @Transactional
    void testUpdateTaskTitle() {
        var taskId = 2;
        var expectedNewTitleStr = "newTitle";
        var expectedUpdatedDate = LocalDateTime.now();

        var updateCount = underTest.updateTitle(taskId, expectedNewTitleStr, expectedUpdatedDate);
        var updatedTask2 = underTest.findById(taskId).orElseThrow();

        assertThat(updateCount).isGreaterThan(0);
        assertThat(updatedTask2.getTitle()).isEqualTo(expectedNewTitleStr);
        // https://stackoverflow.com/a/38905987/16648127
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSSSS");
        assertThat(updatedTask2.getUpdatedAt().format(formatter)).isEqualTo(expectedUpdatedDate.format(formatter));
    }
}
