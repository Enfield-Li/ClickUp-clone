package com.example.task.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.EAGER;
import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
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

  @NotNull
  private Integer dueDate;

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
  private Set<Participant> watchers = new HashSet<>();

  @OneToMany(
    mappedBy = "taskAssignee",
    fetch = EAGER,
    cascade = { PERSIST, DETACH, MERGE }
  )
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

  public void addParticipant(Participant participant) {
    watchers.add(participant);
    participant.setTaskWatcher(this);
  }

  public void removeParticipant(Participant participant) {
    watchers.remove(participant);
    participant.setTaskWatcher(null);
  }
}
