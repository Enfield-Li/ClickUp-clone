package com.example.task.model;

import com.example.task.dto.CreateTaskDTO;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

    @NotNull
    private Integer listId;

    private Boolean archived;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer statusId;

    @NotNull
    @JoinColumn(name = "statusId")
    @OneToOne(fetch = FetchType.EAGER,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private StatusPosition status;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer priorityId;

    @NotNull
    @JoinColumn(name = "priorityId")
    @OneToOne(fetch = FetchType.EAGER,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private PriorityPosition priority;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer dueDateId;

    private LocalDateTime expectedDueDate;

    private String description;

    @CreationTimestamp
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
    @OneToMany(mappedBy = "parentTask",
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL)
    private Set<Task> subTasks = new HashSet<>();

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer creatorId;

    @JoinColumn(name = "creatorId")
    @ManyToOne(cascade = CascadeType.ALL)
    private UserInfo creator;

    @Builder.Default
    @ManyToMany(mappedBy = "assignedTasks",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER)
    private Set<UserInfo> assignees = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "watchedTasks",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER)
    private Set<UserInfo> watchers = new HashSet<>();

    public void addSubTask(Task task) {
        subTasks.add(task);
        task.setParentTask(this);
    }

    public void removeSubTask(Task task) {
        subTasks.remove(task);
        task.setParentTask(null);
    }

    public void addWatcher(UserInfo watcher) {
        watchers.add(watcher);
        watcher.getWatchedTasks().add(this);
    }

    public void removeWatcher(UserInfo watcher) {
        watchers.remove(watcher);
        watcher.getWatchedTasks().remove(this);
    }

    public void addAssignee(UserInfo assignee) {
        assignees.add(assignee);
        assignee.getAssignedTasks().add(this);
    }

    public void removeAssignee(UserInfo assignee) {
        assignees.remove(assignee);
        assignee.getAssignedTasks().remove(this);
    }

    public static Task convertFromCreateTaskDto(
            CreateTaskDTO createTaskDTO) {
        return Task
                .builder()
                .title(createTaskDTO.title())
                .listId(createTaskDTO.listId())
                .status(createTaskDTO.status())
                .priority(createTaskDTO.priority())
                .description(createTaskDTO.description())
                .expectedDueDate(createTaskDTO.expectedDueDate())
                .build();
    }
}
