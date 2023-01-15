package com.example.team.model;

import static com.example.team.TeamServiceConstants.SPACE_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.SPACE_ORDER_INDEX_CONSTRAINT;

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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
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
        @UniqueConstraint(columnNames = {
                "teamId", "name"
        }, name = SPACE_NAME_CONSTRAINT),
        @UniqueConstraint(columnNames = {
                "teamId", "orderIndex",
        }, name = SPACE_ORDER_INDEX_CONSTRAINT)
})
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    private String color;

    @Column(columnDefinition = "LONGTEXT")
    private String avatar;

    @NotNull
    private Integer orderIndex;

    @Builder.Default
    private Boolean isPrivate = false;

    @NotNull
    private Integer statusColumnsCategoryId;

    @Transient
    private final Set<Integer> allListOrFolder = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "spaces", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> members = new HashSet<>();

    @Column(updatable = false, insertable = false)
    private Integer teamId;

    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "teamId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Team team;

    @Builder.Default
    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<FolderCategory> folderCategories = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ListCategory> listCategories = new HashSet<>();

    public void addMember(UserInfo userInfo) {
        members.add(userInfo);
        userInfo.getSpaces().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getSpaces().remove(this);
    }

    public void addFolderCategory(FolderCategory folderCategory) {
        folderCategories.add(folderCategory);
        folderCategory.setSpace(this);
    }

    public void removeFolderCategory(FolderCategory folderCategory) {
        folderCategories.remove(folderCategory);
        folderCategory.setSpace(null);
    }

    public void addListCategory(ListCategory listCategory) {
        listCategories.add(listCategory);
        listCategory.setSpace(this);
    }

    public void removeListCategory(ListCategory listCategory) {
        listCategories.remove(listCategory);
        listCategory.setSpace(null);
    }

    public void addListCategory(Set<ListCategory> listCategories) {
        listCategories.forEach(listCategory -> addListCategory(listCategory));
    }

    public static Space convertFromCreateSpaceDTO(
            CreateSpaceDTO createSpaceDTO, UserInfo userInfo) {
        var listCategory = ListCategory.builder()
                .name("list")
                .orderIndex(1)
                .creator(userInfo)
                .statusColumnsCategoryId(
                        createSpaceDTO.statusColumnsCategoryId())
                .build();
        listCategory.addMember(userInfo);
        var listCategories = Set.of(listCategory);

        var space = Space.builder()
                .listCategories(listCategories)
                .name(createSpaceDTO.name())
                .color(createSpaceDTO.color())
                .avatar(createSpaceDTO.avatar())
                .teamId(createSpaceDTO.teamId())
                .isPrivate(createSpaceDTO.isPrivate())
                .orderIndex(createSpaceDTO.orderIndex())
                .statusColumnsCategoryId(
                        createSpaceDTO.statusColumnsCategoryId())
                .build();
        space.addMember(userInfo);

        listCategory.setSpace(space);
        return space;
    }

    public static Space initTeamSpace(Integer defaultStatusCategoryId,
            UserInfo userInfo) {
        var space = Space.builder()
                .name("space")
                .color("gray")
                .orderIndex(1)
                .isPrivate(false)
                .statusColumnsCategoryId(defaultStatusCategoryId)
                .build();

        space.addMember(userInfo);
        return space;
    }
}
