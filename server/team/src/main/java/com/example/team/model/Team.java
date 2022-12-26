package com.example.team.model;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
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

import com.example.clients.jwt.UserCredentials;
import com.example.team.dto.CreateTeamDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = { "spaces" })
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

    private String avatar;

    @NotNull
    @OneToOne(cascade = CascadeType.ALL)
    private UserInfo owner;

    @Builder.Default
    private Boolean isPrivate = false;

    @Builder.Default
    @OneToMany(mappedBy = "team", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Space> spaces = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "team", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> members = new HashSet<>();

    public static Team convertFromCreateTeamDTO(
            CreateTeamDTO createTeamDTO, UserCredentials userCredentials) {
        var userInfo = UserInfo.builder()
                .userId(userCredentials.userId())
                .username(userCredentials.username())
                .build();

        var team = Team.builder()
                .owner(userInfo)
                .members(Set.of(userInfo))
                .name(createTeamDTO.name())
                .color(createTeamDTO.color())
                .avatar(createTeamDTO.avatar())
                .build();

        userInfo.setTeam(team);
        return team;
    }

    public static Team bindTeamSpace(Team team) {
        team.getSpaces().forEach(space -> {
            if (team.getId() != null) {
                space.setTeamId(team.getId());
            }
            space.setTeam(team);
        });

        return team;
    }

    public static List<Team> bindSpace(List<Team> teamList) {
        teamList.forEach(team -> bindTeamSpace(team));
        return teamList;
    }
}
