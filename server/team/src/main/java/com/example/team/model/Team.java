package com.example.team.model;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
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

    private String color;

    @Column(columnDefinition = "LONGTEXT")
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
    @ManyToMany(mappedBy = "teams", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> members = new HashSet<>();

    public void addSpace(Space space) {
        spaces.add(space);
        space.setTeam(this);
    }

    public void removeSpace(Space space) {
        spaces.remove(space);
        space.setTeam(null);
    }

    public void addMember(UserInfo userInfo) {
        members.add(userInfo);
        userInfo.getTeams().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getTeams().remove(this);
    }

    public static Team initTeamCreation(CreateTeamDTO createTeamDTO,
            UserInfo userInfo) {
        var team = Team.builder()
                .owner(userInfo)
                .name(createTeamDTO.name())
                .color(createTeamDTO.color())
                .avatar(createTeamDTO.avatar())
                .build();

        team.addMember(userInfo);
        return team;
    }

    public Boolean isUserMemberOfTeam(Integer userId) {
        var isMember = this.getMembers().stream()
                .filter(member -> member.getId() == userId)
                .findAny().isPresent();
        return isMember;
    }
}
