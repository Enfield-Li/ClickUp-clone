package com.example.teamStatusCategory.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "statusCategory")
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"title", "statusCategoryId"})
})
public class StatusColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String title;

    private String color;

    @NotNull
    private Integer orderIndex;

    @Column(updatable = false)
    private Boolean markAsClosed;

    @Column(updatable = false)
    private Boolean isDefaultStatus;

    @Column(updatable = false, insertable = false)
    private Integer statusCategoryId;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "statusCategoryId")
    private StatusCategory statusCategory;

    public StatusColumn(StatusColumn statusColumn) {
        this.title = statusColumn.title;
        this.color = statusColumn.color;
        this.orderIndex = statusColumn.orderIndex;
        this.markAsClosed = statusColumn.markAsClosed;
        this.isDefaultStatus = statusColumn.isDefaultStatus;
    }

    public StatusColumn(Boolean isDefaultStatus, @NotNull String title,
                        String color, @NotNull Integer orderIndex) {
        this.title = title;
        this.color = color;
        this.orderIndex = orderIndex;
        this.isDefaultStatus = isDefaultStatus;
    }

    public StatusColumn(@NotNull String title, String color,
                        @NotNull Integer orderIndex) {
        this.title = title;
        this.color = color;
        this.orderIndex = orderIndex;
    }

    public StatusColumn(@NotNull String title, String color,
                        @NotNull Integer orderIndex, Boolean markAsClosed) {
        this.title = title;
        this.color = color;
        this.orderIndex = orderIndex;
        this.markAsClosed = markAsClosed;
    }

    public static Set<StatusColumn> initCustomStatusColumns() {
        var todo = new StatusColumn(true, "TO DO", "rgb(211, 211, 211)", 1);
        var done = new StatusColumn("DONE", "rgb(107, 201, 80)", 999, true);
        return Set.of(todo, done);
    }

    public static Set<StatusColumn> initNormalStatusColumns() {
        var todo = new StatusColumn(true, "TO DO", "rgb(211, 211, 211)", 1);
        var inProgress = new StatusColumn("IN PROGRESS", "rgb(168, 117, 255)", 2);
        var done = new StatusColumn("DONE", "rgb(107, 201, 80)", 999, true);
        return Set.of(todo, inProgress, done);
    }

    public static Set<StatusColumn> initKanbanStatusColumns() {
        var open = new StatusColumn(true, "OPEN", "rgb(211, 211, 211)", 1);
        var inProcess = new StatusColumn("IN PROGRESS", "rgb(65, 148, 246)", 2);
        var review = new StatusColumn("REVIEW", "rgb(168, 117, 255)", 3);
        var closed = new StatusColumn("CLOSED", "rgb(107, 201, 80)", 999, true);
        return Set.of(open, inProcess, review, closed);
    }

    public static Set<StatusColumn> initMarketingStatusColumns() {
        var open = new StatusColumn(true, "OPEN", "rgb(211, 211, 211)", 1);
        var concept = new StatusColumn("CONCEPT", "rgb(255, 204, 0)", 2);
        var inProcess = new StatusColumn("IN PROGRESS", "rgb(255, 84, 13)", 3);
        var running = new StatusColumn("RUNNING", "rgb(255, 0, 223)", 4);
        var review = new StatusColumn("REVIEW", "rgb(168, 117, 255)", 5);
        var closed = new StatusColumn("CLOSED", "rgb(107, 201, 80)", 999, true);
        return Set.of(open, concept, inProcess, running, review, closed);
    }

    public static Set<StatusColumn> initScrumStatusColumns() {
        var open = new StatusColumn(true, "OPEN", "rgb(211, 211, 211)", 1);
        var pending = new StatusColumn("PENDING", "rgb(255, 204, 0)", 2);
        var inProcess = new StatusColumn("IN PROGRESS", "rgb(255, 84, 13)", 3);
        var completed = new StatusColumn("COMPLETED", "black", 4);
        var inReview = new StatusColumn("IN REVIEW", "rgb(255, 153, 0)", 5);
        var accepted = new StatusColumn("ACCEPTED", "rgb(248, 28, 7)", 6);
        var rejected = new StatusColumn("REJECTED", "rgb(255, 0, 223)", 7);
        var blocked = new StatusColumn("BLOCKED", "rgb(168, 117, 255)", 8);
        var closed = new StatusColumn("CLOSED", "rgb(107, 201, 80)", 999, true);
        return Set.of(open, pending, inProcess, completed, inReview, accepted,
                rejected, blocked, closed);
    }
}
