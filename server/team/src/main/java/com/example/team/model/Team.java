package com.example.team.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;

import com.example.team.dto.CreateTeamDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreationTimestamp
    private Date createdAt;

    @NotNull
    private String name;

    @NotNull
    private String color;

    @NotNull
    @OneToOne
    private UserInfo owner;

    @Builder.Default
    private Boolean isPrivate = false;

    @Builder.Default
    @OneToMany(mappedBy = "team", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Space> spaces = new HashSet<>();

    @OneToMany
    @Builder.Default
    private Set<UserInfo> members = new HashSet<>();

    public static Team convertFromCreateTeamDTO(
            CreateTeamDTO createTeamDTO, UserInfo userInfo) {

        return Team.builder()
                .owner(userInfo)
                .members(Set.of(userInfo))
                .name(createTeamDTO.name())
                .isPrivate(createTeamDTO.isPrivate())
                .build();
    }
}