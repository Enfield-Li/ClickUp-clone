package com.example.authorization;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String color;

    @NotNull
    private String email;

    @NotNull
    @JsonIgnore
    private String password;

    @NotNull
    private String username;

    private Integer defaultTeamId;

    @NotNull
    @Builder.Default
    private Integer joinedTeamCount = 0;

    @NotNull
    @Builder.Default
    private Integer refreshTokenVersion = 0;
}
