package com.example.team.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

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
@EqualsAndHashCode(exclude = { "teams", "spaces" })
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "userId", "username" })
})
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

    @JsonIgnore
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "team_user_info",
        joinColumns = @JoinColumn(name = "user_info_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private Set<Team> teams = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "space_user_info",
        joinColumns = @JoinColumn(name = "user_info_id"),
        inverseJoinColumns = @JoinColumn(name = "space_id")
    )
    private Set<Space> spaces = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "folder_category_user_info",
        joinColumns = @JoinColumn(name = "user_info_id"),
        inverseJoinColumns = @JoinColumn(name = "folder_category_id")
    )
    private Set<FolderCategory> folderCategories = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "list_category_user_info",
        joinColumns = @JoinColumn(name = "user_info_id"),
        inverseJoinColumns = @JoinColumn(name = "list_category_id")
    )
    private Set<ListCategory> listCategories = new HashSet<>();
}
