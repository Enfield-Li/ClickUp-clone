package com.example.team.model;

import com.example.team.dto.CreateListDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static com.example.team.TeamServiceConstants.LIST_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.LIST_ORDER_INDEX_CONSTRAINT;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "name",
                "spaceId",
                "parentFolderId"
        }, name = LIST_NAME_CONSTRAINT),
        @UniqueConstraint(columnNames = {
                "orderIndex",
                "spaceId",
                "parentFolderId"
        }, name = LIST_ORDER_INDEX_CONSTRAINT)
})
public class ListCategory {

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

    @Builder.Default
    private Integer taskAmount = 0;

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
    @ManyToMany(mappedBy = "joinedListCategories",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER)
    private Set<UserInfo> members = new HashSet<>();

    @Column(updatable = false, insertable = false)
    private Integer spaceId;

    @NotNull
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "spaceId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Space space;

    @Column(updatable = false, insertable = false)
    private Integer parentFolderId;

    @ManyToOne
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "parentFolderId")
    private FolderCategory folderCategory;

    public void addMember(UserInfo userInfo) {
        members.add(userInfo);
        userInfo.getJoinedListCategories().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getJoinedListCategories().remove(this);
    }

    public static ListCategory convertFromCreateListDTO(
            CreateListDTO dto, UserInfo userInfo) {
        var listCategory = ListCategory.builder()
                .name(dto.name())
                .creator(userInfo)
                .orderIndex(dto.orderIndex())
                .defaultStatusCategoryId(dto.defaultStatusCategoryId())
                .build();

        listCategory.addMember(userInfo);
        return listCategory;
    }
}
