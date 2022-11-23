package com.example.task.model;

import static javax.persistence.FetchType.EAGER;

import com.example.task.dto.UpdateTaskDTO;
import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.taskPosition.TaskDueDatePosition;
import com.example.task.model.taskPosition.TaskPriorityPosition;
import com.example.task.model.taskPosition.TaskStatusPosition;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String title;

    private Boolean archived;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer statusId;

    @NotNull
    @JoinColumn(name = "statusId")
    @OneToOne(cascade = CascadeType.ALL)
    private TaskStatusPosition status;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer priorityId;

    @NotNull
    @JoinColumn(name = "priorityId")
    @OneToOne(cascade = CascadeType.ALL)
    private TaskPriorityPosition priority;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer dueDateId;

    @NotNull
    @JoinColumn(name = "dueDateId")
    @OneToOne(cascade = CascadeType.ALL)
    private TaskDueDatePosition dueDate;

    private Date expectedDueDate;

    private String description;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer userInfoId;

    @NotNull
    @JoinColumn(name = "userInfoId")
    @OneToOne(cascade = CascadeType.ALL)
    private Participant creator;

    @CreationTimestamp
    @Column(updatable = false)
    // ^ IDK why is this broken, createdAt will be updated to null, if this wasn't included
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer parentTaskId;

    @ManyToOne
    // @ToString.Exclude
    @JoinColumn(name = "parentTaskId")
    private Task parentTask;

    @Builder.Default
    @OneToMany(
        mappedBy = "parentTask",
        fetch = FetchType.EAGER,
        cascade = CascadeType.ALL
    )
    private Set<Task> subTasks = new HashSet<>();

    @NotNull
    @OneToMany(
        mappedBy = "taskWatcher",
        fetch = EAGER,
        cascade = CascadeType.ALL
    )
    @Builder.Default
    private Set<Participant> watchers = new HashSet<>();

    @OneToMany(
        mappedBy = "taskAssignee",
        fetch = EAGER,
        cascade = CascadeType.ALL
    )
    @Builder.Default
    private Set<Participant> assignees = new HashSet<>();

    // public void addWatcher(Participant userInfo) {
    //     watchers.add(userInfo);
    //     userInfo.setTaskWatcher(this);
    // }

    // public void removeWatcher(Participant userInfo) {
    //     watchers.remove(userInfo);
    //     userInfo.setTaskWatcher(null);
    // }

    public static Task convertFromUpdateTaskDto(UpdateTaskDTO updateTaskDTO) {
        var task = Task
            .builder()
            .id(updateTaskDTO.id())
            .creator(updateTaskDTO.creator())
            //
            .title(updateTaskDTO.title())
            .status(updateTaskDTO.status())
            .dueDate(updateTaskDTO.dueDate())
            .priority(updateTaskDTO.priority())
            .description(updateTaskDTO.description())
            .expectedDueDate(updateTaskDTO.expectedDueDate())
            //
            .watchers(updateTaskDTO.watchers())
            .assignees(updateTaskDTO.assignees())
            .build();

        setTaskForWatcher(task); // Manage relationship
        return task;
    }

    public static Task convertFromCreateTaskDto(
        CreateTaskDTO createTaskDTO,
        Integer creatorId,
        String creatorName
    ) {
        // Initialize creator as watcher (*default)
        var creatorAsWatcher = Set.of(
            Participant
                .builder()
                .userId(creatorId)
                .username(creatorName)
                .build()
        );

        var task = Task
            .builder()
            .creator(createTaskDTO.creator())
            //
            .title(createTaskDTO.title())
            .status(createTaskDTO.status())
            .dueDate(createTaskDTO.dueDate())
            .priority(createTaskDTO.priority())
            .description(createTaskDTO.description())
            //
            .watchers(creatorAsWatcher)
            .expectedDueDate(createTaskDTO.expectedDueDate())
            .build();

        setTaskForWatcher(task); // Manage relationship
        return task;
    }

    // Manage task/watcher relationship in task
    private static Task setTaskForWatcher(Task task) {
        task
            .getWatchers()
            .forEach(watcher -> {
                if (task.getId() != null) {
                    watcher.setTaskWatcherId(task.getId());
                }
                watcher.setTaskWatcher(task);
            });
        return task;
    }

    // Manage task/watcher relationship in taskList
    public static List<Task> setTaskForWatcher(List<Task> taskList) {
        taskList.forEach(task -> setTaskForWatcher(task));
        return taskList;
    }
}
