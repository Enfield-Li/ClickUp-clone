package com.example.task.model;

import static javax.persistence.CascadeType.*;
import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
class Event {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private Integer updateTo;
  private Integer updateFrom;
  private String commentContent;

  @Enumerated(EnumType.STRING)
  private UpdateAction updateAction;

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
  @Column(updatable = false, insertable = false)
  private Integer task_id;

  @JsonIgnore
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "task_id")
  private Task task;
}
