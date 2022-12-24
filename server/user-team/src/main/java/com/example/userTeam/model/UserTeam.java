package com.example.userTeam.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import com.example.userTeam.dto.CreateNewUserTeamDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @Builder.Default
    @ElementCollection(targetClass = Integer.class)
    private Set<Integer> joinedTeamIds = new HashSet<>();

    public static UserTeam convertFromCreateNewUserTeamDTO(
            CreateNewUserTeamDTO createNewUserTeamDTO) {
        var userId = createNewUserTeamDTO.userId();
        var teamId = createNewUserTeamDTO.teamId();

        return UserTeam.builder()
                .userId(userId)
                .joinedTeamIds(Set.of(teamId))
                .build();
    }
}
