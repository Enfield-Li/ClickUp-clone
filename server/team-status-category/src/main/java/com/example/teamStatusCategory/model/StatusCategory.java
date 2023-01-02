package com.example.teamStatusCategory.model;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.example.teamStatusCategory.dto.CreateStatusCategoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "name", "teamId" })
})
public class StatusCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    @NotNull
    private Integer teamId;

    @OneToMany(mappedBy = "statusCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<StatusColumn> statusColumns;

    public StatusCategory(@NotNull String name,
            Set<StatusColumn> statusColumns, @NotNull Integer teamId) {
        this.name = name;
        this.teamId = teamId;
        this.statusColumns = statusColumns;
    }

    public static List<StatusCategory> initDefaultStatusCategories(
            Integer teamId) {
        var scrumStatusColumns = StatusColumn.initScrumStatusColumns();
        var customStatusColumns = StatusColumn.initCustomStatusColumns();
        var normalStatusColumns = StatusColumn.initNormalStatusColumns();
        var kanbanStatusColumns = StatusColumn.initKanbanStatusColumns();
        var marketingStatusColumns = StatusColumn.initMarketingStatusColumns();

        var scrum = new StatusCategory("Scrum", scrumStatusColumns, teamId);
        var custom = new StatusCategory("Custom", customStatusColumns, teamId);
        var normal = new StatusCategory("Normal", normalStatusColumns, teamId);
        var kanban = new StatusCategory("Kanban", kanbanStatusColumns, teamId);
        var marketing = new StatusCategory("Marketing", marketingStatusColumns, teamId);

        bindStatusCategory(scrum, scrumStatusColumns);
        bindStatusCategory(custom, customStatusColumns);
        bindStatusCategory(normal, normalStatusColumns);
        bindStatusCategory(kanban, kanbanStatusColumns);
        bindStatusCategory(marketing, marketingStatusColumns);

        return List.of(custom, normal, kanban, scrum, marketing);
    }

    private static void bindStatusCategory(
            StatusCategory statusCategory,
            Set<StatusColumn> statusColumns) {
        statusColumns.forEach(column -> {
            column.setStatusCategory(statusCategory);
        });
    }

    public static StatusCategory convertCreateStatusCategoryDTO(
            CreateStatusCategoryDTO dto) {
        var statusColumns = dto.statusColumns();
        statusColumns.forEach(statusColumn -> statusColumn.setId(null));

        var statusCategory = StatusCategory.builder()
                .name(dto.name())
                .teamId(dto.teamId())
                .statusColumns(statusColumns)
                .build();
        bindStatusCategory(statusCategory, statusColumns);

        return statusCategory;
    }
}
