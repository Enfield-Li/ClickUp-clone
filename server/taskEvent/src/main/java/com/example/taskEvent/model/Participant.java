package com.example.taskEvent.model;

import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
  private Integer taskWatcherId;
  private Integer taskAssigneeId;

  @JsonIgnore
  @Column(updatable = false, insertable = false)
  private Integer eventId;

  @JsonIgnore
  @ToString.Exclude
  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "eventId")
  private TaskEvent taskEvent;
}
