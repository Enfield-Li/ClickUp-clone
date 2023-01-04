package com.example.team.model;

import java.util.HashSet;
import java.util.Set;
import static javax.persistence.FetchType.LAZY;

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
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    private String color;

    @NotNull
    private Integer orderIndex;

    @Builder.Default
    private Boolean isPrivate = false;

    private Integer defaultStatusColumnId;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer teamId;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "teamId")
    private Team team;

    @Builder.Default
    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Category> allListOrFolder = new HashSet<>();

    public static Space convertFromCreateSpaceDTO(CreateSpaceDTO createSpaceDTO) {
        return Space.builder()
                .name(createSpaceDTO.name())
                .color(createSpaceDTO.color())
                .teamId(createSpaceDTO.teamId())
                .isPrivate(createSpaceDTO.isPrivate())
                .orderIndex(createSpaceDTO.orderIndex())
                .defaultStatusColumnId(createSpaceDTO.defaultStatusColumnId())
                .build();
    }

}
