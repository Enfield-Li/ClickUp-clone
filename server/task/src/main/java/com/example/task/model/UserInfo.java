package com.example.task.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "username"})})
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "creator",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private Set<Task> tasks = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "task_assignee_user_info",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "task_assignee_id"))
    private Set<Task> assignedTasks = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "task_watcher_user_info",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "task_watcher_id"))
    private Set<Task> watchedTasks = new HashSet<>();

    public void addTask(Task task) {
        tasks.add(task);
        task.setCreator(this);
    }

    public void removeTask(Task task) {
        tasks.remove(task);
        task.setCreator(null);
    }
}
