package com.example.task.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import static javax.persistence.CascadeType.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NotNull
  @Column(unique = true)
  private String title;

  private Integer status;
  private Integer dueDate;
  private Integer priority;
  private String description;

  @OneToOne(cascade = { PERSIST, DETACH, MERGE })
  private PreviousTask previousItem;
}
