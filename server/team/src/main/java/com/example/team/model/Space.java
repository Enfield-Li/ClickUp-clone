package com.example.team.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.example.team.dto.CreateSpaceDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "name", "teamId" })
})
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    private String color;

    private String avatar;

    @NotNull
    private Integer orderIndex;

    @Builder.Default
    private Boolean isPrivate = false;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer teamId;

    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "teamId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Team team;

    @Builder.Default
    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Category> allListOrFolder = new HashSet<>();

    public static Space convertFromCreateSpaceDTO(
            CreateSpaceDTO createSpaceDTO,
            Team team) {
        return Space.builder()
                .team(team)
                .name(createSpaceDTO.name())
                .color(createSpaceDTO.color())
                .avatar(createSpaceDTO.avatar())
                .teamId(createSpaceDTO.teamId())
                .isPrivate(createSpaceDTO.isPrivate())
                .orderIndex(createSpaceDTO.orderIndex())
                .build();
    }
}
