package com.example.team.model;

import com.example.team.dto.CreateFolderDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.example.team.TeamServiceConstants.FOLDER_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.FOLDER_ORDER_INDEX_CONSTRAINT;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "spaceId",
                "name"
        }, name = FOLDER_NAME_CONSTRAINT),
        @UniqueConstraint(columnNames = {
                "spaceId",
                "orderIndex"
        }, name = FOLDER_ORDER_INDEX_CONSTRAINT)
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    private Integer defaultStatusCategoryId;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer creatorId;

    @NotNull
    @JoinColumn(name = "creatorId")
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = false)
    private UserInfo creator;

    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "joinedFolderCategories", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<UserInfo> members = new HashSet<>();

    @Column(updatable = false, insertable = false)
    private Integer spaceId;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "spaceId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Space space;

    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "folderCategory",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true)
    private Set<ListCategory> allLists = new HashSet<>();

    public void addMember(UserInfo userInfo) {
        members.add(userInfo);
        userInfo.getJoinedFolderCategories().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getJoinedFolderCategories().remove(this);
    }

    public void addListCategory(ListCategory listCategory) {
        allLists.add(listCategory);
        listCategory.setFolderCategory(this);
    }

    public void removeListCategory(ListCategory listCategory) {
        allLists.remove(listCategory);
        listCategory.setFolderCategory(null);
    }

    public void removeAllListCategories() {
        allLists.forEach(listCategory -> {
            listCategory.removeAllMembers();
            listCategory.setFolderCategory(null);
        });
        allLists.clear();
    }

    public void removeAllMembers() {
        members.forEach(this::removeMember);
    }

    public static FolderCategory convertFromCreateFolderDTO(
            CreateFolderDTO dto, UserInfo userInfo) {
        var folderCategory = FolderCategory.builder()
                .name(dto.name())
                .creator(userInfo)
                .isPrivate(dto.isPrivate())
                .orderIndex(dto.orderIndex())
                .defaultStatusCategoryId(dto.defaultStatusCategoryId())
                .build();
        folderCategory.addMember(userInfo);

        Set<ListCategory> allListCategory =
                IntStream.range(0, dto.allListNames().size())
                        .mapToObj(index -> {
                            var currentListName = dto.allListNames().get(index);
                            var listCategory = ListCategory.builder()
                                    .creator(userInfo)
                                    .name(currentListName)
                                    .orderIndex(index + 1)
                                    .folderCategory(folderCategory)
                                    .defaultStatusCategoryId(
                                            dto.defaultStatusCategoryId())
                                    .build();

                            listCategory.addMember(userInfo);
                            return listCategory;
                        })
                        .collect(Collectors.toSet());

        folderCategory.setAllLists(allListCategory);
        return folderCategory;
    }

}
