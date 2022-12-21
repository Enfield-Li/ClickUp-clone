package com.example.taskEvent.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.clients.taskEvent.assignmentEventDTO.AssignmentEventAction;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class AssignmentEvent extends BaseEvent {

    @NotNull
    @Enumerated(EnumType.STRING)
    private AssignmentEventAction assignmentAction;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer assignedUserId;

    @NotNull
    @JoinColumn(name = "assignedUserId")
    @OneToOne(cascade = { PERSIST, DETACH, MERGE })
    private UserInfo assignedUser;
}
