package com.example.task.model.taskPosition;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
// https://stackoverflow.com/questions/31664098/lombok-builder-inheritance-workaround
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriorityPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer columnId;

    @NotNull
    private Integer orderIndex;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Priority name;
}
