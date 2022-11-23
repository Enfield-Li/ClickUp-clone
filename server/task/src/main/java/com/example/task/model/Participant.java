package com.example.task.model;

import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(value = { "id" })
@EqualsAndHashCode(exclude = { "taskWatcher" })
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer taskWatcherId;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "taskWatcherId")
    private Task taskWatcher;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer taskAssigneeId;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "taskAssigneeId")
    private Task taskAssignee;
}
