package com.example.panelActivity.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
public class PanelActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private Integer defaultTeamId;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<TeamActivity> teamActivities = new HashSet<>();

    public static PanelActivity initPanelActivity(
            Integer userId, Integer teamId, Integer spaceId) {
        var defaultTeamActivity = TeamActivity.builder()
                .teamId(teamId)
                .spaceId(spaceId)
                .build();

        return PanelActivity.builder()
                .userId(userId)
                .defaultTeamId(teamId)
                .teamActivities(Set.of(defaultTeamActivity))
                .build();

    }
}
