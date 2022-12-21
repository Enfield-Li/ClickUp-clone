package com.example.taskComment.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

    // @NotNull
    private String reaction;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer taskCommentId;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "taskCommentId")
    private TaskComment taskComment;
    // @JsonIgnore
    // @ManyToMany(
    //     mappedBy = "reactions",
    //     cascade = { PERSIST, DETACH, MERGE },
    //     fetch = LAZY
    // )
    // private Set<TaskComment> taskComments = new HashSet<>();
}
