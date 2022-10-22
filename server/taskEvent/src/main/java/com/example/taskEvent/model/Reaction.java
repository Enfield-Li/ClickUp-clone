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
    private Integer commentEventId;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "commentEventId")
    private CommentEvent commentEvent;
}
