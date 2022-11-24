package com.example.task.model.taskPosition;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;
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
@JsonIgnoreProperties(value = { "id" })
abstract class Position<T> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private T name;

    @NotNull
    private Integer columnId;

    @NotNull
    @Column(unique = true)
    private Integer orderIndex;
}
