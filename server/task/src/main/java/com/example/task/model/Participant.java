package com.example.task.model;

import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.apache.commons.lang3.builder.ToStringExclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Participant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private Integer userId;
  private String username;

  @Column(updatable = false, insertable = false)
  private Integer event_id;

  @JsonIgnore
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "event_id")
  private Event event;

  @Column(updatable = false, insertable = false)
  private Integer task_watcher_id;

  @JsonIgnore
  @ToStringExclude
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "task_watcher_id")
  private Task task_watcher;

  @Column(updatable = false, insertable = false)
  private Integer task_assignee_id;

  @JsonIgnore
  @ToStringExclude
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "task_assignee_id")
  private Task task_assignee;

  public void setTask_watcher(Task task_watcher) {
    this.task_watcher = task_watcher;
  }
}
