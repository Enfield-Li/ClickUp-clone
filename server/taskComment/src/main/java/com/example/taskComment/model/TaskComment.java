package com.example.taskComment.model;

import static javax.persistence.CascadeType.DETACH;
import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.FetchType.EAGER;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TaskComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Transient
    @Builder.Default
    private String field = "comment";

    @NotNull
    private Integer taskId;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

    @NotNull
    private String comment;

    @ManyToMany(cascade = { PERSIST, DETACH, MERGE }, fetch = EAGER)
    @JoinTable(
        name = "task_comment_reaction",
        joinColumns = @JoinColumn(name = "task_comment_id"),
        inverseJoinColumns = @JoinColumn(name = "reaction_id"),
        uniqueConstraints = @UniqueConstraint(
            columnNames = { "task_comment_id", "reaction_id" }
        )
    )
    private Set<Reaction> reactions = new HashSet<>();
    /*  
        @OneToMany(
            mappedBy = "commentEvent",
            fetch = EAGER,
            cascade = { PERSIST, DETACH, MERGE }
        )
        private Set<Reaction> reactions = new HashSet<>();
     */
}
