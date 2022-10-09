package com.example.task.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.EAGER;
import static javax.persistence.FetchType.LAZY;

import com.example.task.dto.EventDTO;
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
    mappedBy = "task_watcher",
    fetch = EAGER,
    cascade = { PERSIST, DETACH, MERGE }
  )
  private Set<Participant> watchers = new HashSet<>();

  @OneToMany(
    mappedBy = "task_assignee",
    fetch = EAGER,
    cascade = { PERSIST, DETACH, MERGE }
  )
  private Set<Participant> assignees = new HashSet<>();

  @Column(updatable = false, insertable = false)
  private Integer previous_item_id;

  @JoinColumn(name = "previous_item_id")
  @OneToOne(cascade = { PERSIST, DETACH, MERGE })
  private PreviousTask previousItem;

  @JsonIgnore
  @OneToMany(
    mappedBy = "task",
    fetch = LAZY,
    cascade = { PERSIST, DETACH, MERGE }
  )
  private Set<Event> events = new HashSet<>();

  public void addParticipant(Participant participant) {
    watchers.add(participant);
    participant.setTask_watcher(this);
  }

  public void removeParticipant(Participant participant) {
    watchers.remove(participant);
    participant.setTask_watcher(null);
  }

  public void addEvents(Set<Event> eventDTO) {
    // https://stackoverflow.com/a/30139228/16648127
    var combinedEvents = Stream
      .concat(this.events.stream(), eventDTO.stream())
      .collect(Collectors.toSet());
    this.events = combinedEvents;
    eventDTO.forEach(event -> event.setTask(this));
  }
}
