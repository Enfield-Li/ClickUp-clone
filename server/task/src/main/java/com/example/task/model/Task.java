package com.example.task.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.EAGER;

import com.example.task.dto.UpdateTaskDTO;
import com.example.task.dto.unused.CreateTaskDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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

    @NotNull
    private Integer status;

    private Date expectedDueDate;

    @NotNull
    private Integer priority;

    private String description;

    @NotNull
    private Integer creatorId;

    @NotNull
    private String creatorName;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @NotNull
    @OneToMany(
        mappedBy = "taskWatcher",
        fetch = EAGER,
        cascade = { PERSIST, DETACH, MERGE }
    )
    @Builder.Default
    private Set<Participant> watchers = new HashSet<>();

    @OneToMany(
        mappedBy = "taskAssignee",
        fetch = EAGER,
        cascade = { PERSIST, DETACH, MERGE }
    )
    @Builder.Default
    private Set<Participant> assignees = new HashSet<>();

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer previousTaskId;

    @JoinColumn(name = "previousTaskId")
    @OneToOne(cascade = { PERSIST, DETACH, MERGE })
    private PreviousTask previousTask;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer previousTaskBeforeFinishId;

    @JoinColumn(name = "previousTaskBeforeFinishId")
    @OneToOne(cascade = { PERSIST, DETACH, MERGE })
    private PreviousTaskBeforeFinish previousTaskBeforeFinish;

    public void addWatcher(Participant userInfo) {
        watchers.add(userInfo);
        userInfo.setTaskWatcher(this);
    }

    public void removeWatcher(Participant userInfo) {
        watchers.remove(userInfo);
        userInfo.setTaskWatcher(null);
    }

    public static Task updateTaskDtoToTask(
        UpdateTaskDTO taskDTO,
        Integer creatorId,
        String creatorName
    ) {
        return Task
            .builder()
            .creatorId(creatorId)
            .creatorName(creatorName)
            .id(taskDTO.id())
            .title(taskDTO.title())
            .status(taskDTO.status())
            .priority(taskDTO.priority())
            .watchers(taskDTO.watchers())
            .assignees(taskDTO.assignees())
            .description(taskDTO.description())
            .previousTask(taskDTO.previousTask())
            .expectedDueDate(taskDTO.expectedDueDate())
            .previousTaskBeforeFinish(taskDTO.previousTaskBeforeFinish())
            .build();
    }

    public static Task createTaskDtoToTask(
        CreateTaskDTO createTaskDTO,
        Integer creatorId,
        String creatorName
    ) {
        return Task
            .builder()
            .creatorId(creatorId)
            .creatorName(creatorName)
            .title(createTaskDTO.title())
            .status(createTaskDTO.status())
            .priority(createTaskDTO.priority())
            .description(createTaskDTO.description())
            .previousTask(createTaskDTO.previousTask())
            .expectedDueDate(createTaskDTO.expectedDueDate())
            .build();
    }
}
