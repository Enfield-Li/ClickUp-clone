package com.example.teamStatusColumn.model;

import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamStatusColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    @NotNull
    @Column(unique = true)
    private Integer teamId;

    @OneToMany
    private Set<StatusColumn> statusColumns;

    public TeamStatusColumn(@NotNull String name,
            Set<StatusColumn> statusColumns, @NotNull Integer teamId) {
        this.name = name;
        this.teamId = teamId;
        this.statusColumns = statusColumns;
    }

    public static List<TeamStatusColumn> initDefaultTeamStatusColumn(
            Integer teamId) {
        var scrumStatusColumns = StatusColumn.initScrumStatusColumns();
        var customStatusColumns = StatusColumn.initCustomStatusColumns();
        var normalStatusColumns = StatusColumn.initNormalStatusColumns();
        var kanbanStatusColumns = StatusColumn.initKanbanStatusColumns();
        var marketingStatusColumns = StatusColumn.initMarketingStatusColumns();

        var scrum = new TeamStatusColumn("Scrum", scrumStatusColumns, teamId);
        var custom = new TeamStatusColumn("Custom", customStatusColumns, teamId);
        var normal = new TeamStatusColumn("Normal", normalStatusColumns, teamId);
        var kanban = new TeamStatusColumn("Kanban", kanbanStatusColumns, teamId);
        var marketing = new TeamStatusColumn("Marketing", marketingStatusColumns, teamId);

        bindTeamStatusColumn(scrum, scrumStatusColumns);
        bindTeamStatusColumn(custom, customStatusColumns);
        bindTeamStatusColumn(normal, normalStatusColumns);
        bindTeamStatusColumn(kanban, kanbanStatusColumns);
        bindTeamStatusColumn(marketing, marketingStatusColumns);

        return List.of(custom, normal, kanban, scrum, marketing);
    }

    private static void bindTeamStatusColumn(
            TeamStatusColumn teamStatusColumn,
            Set<StatusColumn> statusColumns) {
        statusColumns.forEach(column -> {
            column.setTeamStatusColumn(teamStatusColumn);
        });
    }
}
