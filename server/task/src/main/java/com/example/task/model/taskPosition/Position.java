package com.example.task.model.taskPosition;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

// https://stackoverflow.com/a/47197531/16648127
// https://docs.oracle.com/javaee/5/api/javax/persistence/MappedSuperclass.html
@Data
@SuperBuilder
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
abstract class Position<T> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private T name;
    private Integer columnId;
    private Integer orderIndex;
}
