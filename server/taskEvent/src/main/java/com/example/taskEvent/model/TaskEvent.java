package com.example.taskEvent.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.EAGER;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class TaskEvent {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  // Update action
  private Integer updateTo;
  private Integer updateFrom;

  @Enumerated(EnumType.STRING)
  private UpdateAction updateAction;

  // or comment
  private String commentContent;

  @ManyToOne
  private TaskEvent parentComment;

  @OneToMany(mappedBy = "parentComment")
  private Set<TaskEvent> childrenComments;

  @NotNull
  private Integer initiatorId;

  @NotNull
  private String initiatorName;

  @NotNull
  @Enumerated(EnumType.STRING)
  private EventType eventType;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @NotNull
  private Integer taskId;

  @OneToMany(
    mappedBy = "event",
    fetch = EAGER,
    cascade = { PERSIST, DETACH, MERGE }
  )
  private Set<Participant> participants = new HashSet<>();
}
