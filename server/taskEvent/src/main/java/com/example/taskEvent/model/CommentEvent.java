package com.example.taskEvent.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.EAGER;

import com.example.clients.taskEvent.UpdateEventDTO;
import com.example.taskEvent.dto.CommentEventDTO;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
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
public class CommentEvent extends BaseEvent {

    @NotNull
    private String comment;

    @OneToMany(
        mappedBy = "commentEvent",
        fetch = EAGER,
        cascade = { PERSIST, DETACH, MERGE }
    )
    private Set<Reaction> reactions = new HashSet<>();
}