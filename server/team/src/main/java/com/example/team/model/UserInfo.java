package com.example.team.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"joinedTeams", "joinedSpaces",
        "joinedFolderCategories", "joinedListCategories"})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "username"})
})
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

//    @JsonIgnore
//    @Builder.Default
//    @ToString.Exclude
//    @OneToMany(mappedBy = "creator",
//            fetch = FetchType.LAZY,
//            cascade = CascadeType.ALL)
//    private Set<Team> createdTeams = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "joined_teams_user_info",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "joined_teams_id"))
    private Set<Team> joinedTeams = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "joined_spaces_user_info",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "joined_spaces_id"))
    private Set<Space> joinedSpaces = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "joined_folder_category_user_info",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "joined_folder_category_id"))
    private Set<FolderCategory> joinedFolderCategories = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @ToString.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "joined_list_category_user_info",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "joined_list_category_id"))
    private Set<ListCategory> joinedListCategories = new HashSet<>();

    public void removeJoinedTeam(Team team) {
        joinedTeams.remove(team);
        team.removeMember(this);
        team.getSpaces().forEach(this::removeJoinedSpace);
    }

    public void removeJoinedSpace(Space space) {
        joinedSpaces.remove(space);
        space.removeMember(this);
        space.getListCategories().forEach(this::removeJoinedListCategory);
        space.getFolderCategories().forEach(this::removeJoinedFolderCategory);
    }

    public void removeJoinedFolderCategory(FolderCategory folderCategory) {
        joinedFolderCategories.remove(folderCategory);
        folderCategory.removeMember(this);
        folderCategory.getAllLists().forEach(this::removeJoinedListCategory);
    }

    public void removeJoinedListCategory(ListCategory listCategory) {
        joinedListCategories.remove(listCategory);
        listCategory.removeMember(this);
    }

}
