package com.example.task.model;

import static javax.persistence.CascadeType.*;
import static javax.persistence.FetchType.LAZY;

import java.time.LocalDateTime;
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
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
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
  private Set<Event> events;
}
