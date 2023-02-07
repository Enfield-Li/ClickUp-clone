package com.example.team.model;

import com.example.team.dto.CreateTeamDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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

    private String color;

    @Column(columnDefinition = "LONGTEXT")
    private String avatar;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer ownerId;

    @NotNull
    @JoinColumn(name = "ownerId")
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = false)
    private UserInfo owner;

    @Builder.Default
    private Boolean isPrivate = false;

    @Builder.Default
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "team",
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL)
    private Set<Space> spaces = new HashSet<>();

    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "joinedTeams",
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL)
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
        userInfo.getJoinedTeams().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getJoinedTeams().remove(this);
    }

    public void removeAllMembers() {
        members.forEach(this::removeMember);
    }

    public static Team initTeamCreation(
            CreateTeamDTO createTeamDTO, UserInfo userInfo) {
        var team = Team.builder()
                .owner(userInfo)
                .name(createTeamDTO.name())
                .color(createTeamDTO.color())
                .avatar(createTeamDTO.avatar())
                .build();

        team.addMember(userInfo);
        return team;
    }
}
