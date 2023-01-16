package com.example.task.model;

import static javax.persistence.FetchType.EAGER;

import java.time.LocalDateTime;
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

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.task.dto.unused.CreateTaskDTO;
import com.example.task.model.taskPosition.DueDatePosition;
import com.example.task.model.taskPosition.PriorityPosition;
import com.example.task.model.taskPosition.StatusPosition;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private StatusPosition status;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer priorityId;

    @NotNull
    @JoinColumn(name = "priorityId")
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private PriorityPosition priority;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer dueDateId;

    @NotNull
    @JoinColumn(name = "dueDateId")
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private DueDatePosition dueDate;

    private LocalDateTime expectedDueDate;

    private String description;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer userInfoId;

    @NotNull
    @JoinColumn(name = "userInfoId")
    @OneToOne(cascade = CascadeType.ALL)
    private UserInfo creator;

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
    @OneToMany(mappedBy = "parentTask", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Task> subTasks = new HashSet<>();

    @NotNull
    @Builder.Default
    @OneToMany(mappedBy = "taskWatcher", fetch = EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> watchers = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "taskAssignee", fetch = EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> assignees = new HashSet<>();

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
        watcher.setTaskWatcher(this);
    }

    public void removeWatcher(UserInfo watcher) {
        watchers.remove(watcher);
        watcher.setTaskWatcher(null);
    }

    public void addAssignee(UserInfo assignee) {
        assignees.add(assignee);
        assignee.setTaskAssignee(this);
    }

    public void removeAssignee(UserInfo assignee) {
        assignees.remove(assignee);
        assignee.setTaskAssignee(null);
    }

    public static Task convertFromCreateTaskDto(
            CreateTaskDTO createTaskDTO,
            UserInfo creator) {
        var task = Task
                .builder()
                .creator(creator)
                .title(createTaskDTO.title())
                .listId(createTaskDTO.listId())
                .status(createTaskDTO.status())
                .dueDate(createTaskDTO.dueDate())
                .priority(createTaskDTO.priority())
                .description(createTaskDTO.description())
                .expectedDueDate(createTaskDTO.expectedDueDate())
                .build();

        task.addWatcher(creator);
        return task;
    }
}
