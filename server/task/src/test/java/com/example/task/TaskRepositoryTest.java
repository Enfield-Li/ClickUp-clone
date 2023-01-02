package com.example.task;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.assertj.core.api.WithAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.task.model.Task;
import com.example.task.model.UserInfo;
import com.example.task.model.taskPosition.DueDate;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.Priority;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;

@DataJpaTest
@Transactional
public class TaskRepositoryTest implements WithAssertions {

    @Autowired
    TaskRepository underTest;

    Integer taskOneId;
    Integer taskTwoId;

    String taskOneTitle = "taskOne";
    String taskTwoTitle = "taskTwo";

    @BeforeEach
    void setUp() {
        var status = StatusPosition.builder()
                .columnId(1).orderIndex(1).name("IN_PROGRESS").build();
        var priority = PriorityPosition.builder()
                .columnId(1).orderIndex(1).name(Priority.NORMAL).build();
        var dueDate = DueDatePosition.builder()
                .columnId(1).orderIndex(1).name(DueDate.TODAY).build();
        var creator = UserInfo.builder()
                .userId(1).username("user1").build();

        var task1 = Task.builder()
                .listId(1).title(taskOneTitle).status(status)
                .priority(priority).dueDate(dueDate).creator(creator).build();
        var task2 = Task.builder()
                .listId(1).title(taskTwoTitle).status(status)
                .priority(priority).dueDate(dueDate).creator(creator).build();
        var savedTask1 = underTest.save(task1);
        taskOneTitle = savedTask1.getTitle();
        taskOneId = savedTask1.getId();

        var savedTask2 = underTest.save(task2);
        taskTwoTitle = savedTask2.getTitle();
        taskTwoId = savedTask2.getId();
    }

    @Test
    void get_task_title_should_pass() {
        var taskTitle = underTest.getTaskTitle(taskOneId);
        assertThat(taskTitle).isEqualTo(taskOneTitle);
    }

    @Test
    @Transactional
    void update_task_desc_should_pass() {
        // var expectedNewDescStr = "newDesc";
        // var expectedUpdatedDate = LocalDateTime.now();

        // var updateCount = underTest.updateDesc(
        //         taskTwoId, expectedNewDescStr, expectedUpdatedDate);
        // var updatedTask1 = underTest.findById(taskTwoId).orElseThrow();

        // assertThat(updateCount).isGreaterThan(0);
        // assertThat(updatedTask1.getDescription())
        //         .isEqualTo(expectedNewDescStr);
        // // https://stackoverflow.com/a/38905987/16648127
        // DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
        //         "uuuu-MM-dd'T'HH:mm:ss.SSSSS");
        // assertThat(updatedTask1.getUpdatedAt().format(formatter))
        //         .isEqualTo(expectedUpdatedDate.format(formatter));
    }

    @Test
    @Transactional
    void update_task_title_should_pass() {
        // var expectedNewTitleStr = "newTitle";
        // var expectedUpdatedDate = LocalDateTime.now();

        // var updateCount = underTest.updateTitle(
        //         taskTwoId, expectedNewTitleStr, expectedUpdatedDate);
        // var updatedTask2 = underTest.findById(taskTwoId).orElseThrow();

        // assertThat(updateCount).isGreaterThan(0);
        // assertThat(updatedTask2.getTitle()).isEqualTo(expectedNewTitleStr);
        // // https://stackoverflow.com/a/38905987/16648127
        // DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
        //         "uuuu-MM-dd'T'HH:mm:ss.SSSSS");
        // assertThat(updatedTask2.getUpdatedAt().format(formatter))
        //         .isEqualTo(expectedUpdatedDate.format(formatter));
    }
}
