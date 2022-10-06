package com.example.task.model;

import static javax.persistence.CascadeType.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

  private Integer status;
  private Integer dueDate;
  private Integer priority;
  private String description;

  @Column(updatable = false, insertable = false)
  private Integer previous_item_id;

  @JoinColumn(name = "previous_item_id")
  @OneToOne(cascade = { PERSIST, DETACH, MERGE })
  private PreviousTask previousItem;
}
