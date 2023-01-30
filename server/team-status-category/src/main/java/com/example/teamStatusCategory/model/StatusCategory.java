package com.example.teamStatusCategory.model;

import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "teamId"})
})
public class StatusCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //    @NotNull
    private String name;

    //    @NotNull
    private Integer teamId;

    private Boolean isDefaultCategory;

    @Builder.Default
    @OneToMany(mappedBy = "statusCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<StatusColumn> statusColumns = new HashSet<>();

    public StatusCategory(StatusCategory statusCategory) {
        //        this.teamId = 0;
        //        this.name = statusCategory.name + "_listCloned";
        var clonedStatusColumn = statusCategory.statusColumns.stream().
                map(StatusColumn::new).collect(Collectors.toSet());
        addStatusColumns(clonedStatusColumn);
    }

    public void addStatusColumn(StatusColumn statusColumn) {
        statusColumns.add(statusColumn);
        statusColumn.setStatusCategory(this);
    }

    public void removeStatusColumn(StatusColumn statusColumn) {
        statusColumns.remove(statusColumn);
        statusColumn.setStatusCategory(null);
    }

    public void addStatusColumns(Set<StatusColumn> statusColumnSet) {
        if (statusColumns == null) {
            statusColumns = new HashSet<>();
        }
        statusColumns.addAll(statusColumnSet);
        statusColumnSet.forEach(column -> column.setStatusCategory(this));
    }

    public StatusCategory(
            @NotNull String name,
            @NotNull Integer teamId) {
        this.name = name;
        this.teamId = teamId;
    }

    public StatusCategory(
            @NotNull String name,
            @NotNull Integer teamId,
            Boolean isDefaultCategory) {
        this.name = name;
        this.teamId = teamId;
        this.isDefaultCategory = isDefaultCategory;
    }

    public static List<StatusCategory> initDefaultStatusCategories(
            Integer teamId) {
        var scrumStatusColumns = StatusColumn.initScrumStatusColumns();
        var customStatusColumns = StatusColumn.initCustomStatusColumns();
        var normalStatusColumns = StatusColumn.initNormalStatusColumns();
        var kanbanStatusColumns = StatusColumn.initKanbanStatusColumns();
        var marketingStatusColumns = StatusColumn.initMarketingStatusColumns();

        var scrum = new StatusCategory("Scrum", teamId);
        var normal = new StatusCategory("Normal", teamId);
        var kanban = new StatusCategory("Kanban", teamId);
        var marketing = new StatusCategory("Marketing", teamId);
        var custom = new StatusCategory("Custom", teamId, true);

        scrum.addStatusColumns(scrumStatusColumns);
        custom.addStatusColumns(customStatusColumns);
        normal.addStatusColumns(normalStatusColumns);
        kanban.addStatusColumns(kanbanStatusColumns);
        marketing.addStatusColumns(marketingStatusColumns);

        return List.of(custom, normal, kanban, scrum, marketing);
    }

    public static StatusCategory convertCreateStatusCategoryDTO(
            CreateStatusCategoryDTO dto) {
        var statusColumns = dto.statusColumns();
        statusColumns.forEach(statusColumn -> statusColumn.setId(null));

        var statusCategory = StatusCategory.builder()
                .name(dto.name())
                .teamId(dto.teamId())
                .build();
        statusCategory.addStatusColumns(statusColumns);
        return statusCategory;
    }
}
