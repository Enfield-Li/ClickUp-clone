package com.example.team.model;

import static com.example.team.TeamServiceConstants.CATEGORY_SPACE_ID_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.CATEGORY_SPACE_ID_ORDER_INDEX_CONSTRAINT;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;

import com.example.team.dto.CreateFolderDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "spaceId", "name" }, name = CATEGORY_SPACE_ID_NAME_CONSTRAINT),
        @UniqueConstraint(columnNames = { "spaceId", "orderIndex" }, name = CATEGORY_SPACE_ID_ORDER_INDEX_CONSTRAINT)
})
public class FolderCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    private String color;

    @CreationTimestamp
    private Date createdAt;

    private Boolean isPrivate;

    @NotNull
    private Integer orderIndex;

    @NotNull
    private Integer statusColumnsCategoryId;

    @NotNull
    @JoinColumn(name = "userInfoId")
    @OneToOne(cascade = CascadeType.ALL)
    private UserInfo creator;

    @Builder.Default
    @ManyToMany(mappedBy = "folderCategories", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<UserInfo> members = new HashSet<>();

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer spaceId;

    @NotNull
    @JsonIgnore
    @JoinColumn(name = "spaceId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Space space;

    @Builder.Default
    @OneToMany(mappedBy = "folderCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ListCategory> allLists = new HashSet<>();

    public void addMember(UserInfo userInfo) {
        members.add(userInfo);
        userInfo.getFolderCategories().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getFolderCategories().remove(this);
    }

    public void addListCategory(ListCategory listCategory) {
        allLists.add(listCategory);
        listCategory.setFolderCategory(this);
    }

    public void removeListCategory(ListCategory listCategory) {
        allLists.remove(listCategory);
        listCategory.setFolderCategory(null);
    }

    public static FolderCategory convertFromCreateFolderDTO(
            CreateFolderDTO dto, UserInfo userInfo) {
        var folderCategory = FolderCategory.builder()
                .name(dto.name())
                .creator(userInfo)
                .isPrivate(dto.isPrivate())
                .orderIndex(dto.orderIndex())
                .statusColumnsCategoryId(dto.statusColumnsCategoryId())
                .build();
        folderCategory.addMember(userInfo);

        Set<ListCategory> allListCategory = dto.allListNames().stream()
                .map(name -> {
                    var listCategory = ListCategory.builder()
                            .name(name)
                            .orderIndex(1)
                            .creator(userInfo)
                            .folderCategory(folderCategory)
                            .statusColumnsCategoryId(
                                    dto.statusColumnsCategoryId())
                            .build();

                    listCategory.addMember(userInfo);
                    return listCategory;
                })
                .collect(Collectors.toSet());

        folderCategory.setAllLists(allListCategory);
        return folderCategory;
    }

}
