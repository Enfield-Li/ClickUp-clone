package com.example.task.model.taskPosition;

import javax.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@Entity
// https://stackoverflow.com/questions/31664098/lombok-builder-inheritance-workaround
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class TaskDueDatePosition extends Position<String> {}
