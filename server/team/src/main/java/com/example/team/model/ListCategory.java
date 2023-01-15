package com.example.team.model;

import static com.example.team.TeamServiceConstants.LIST_NAME_CONSTRAINT;
import static com.example.team.TeamServiceConstants.LIST_ORDER_INDEX_CONSTRAINT;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;

import com.example.team.dto.CreateListDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = { "folderCategory", "space" })
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "name",
                "spaceId",
                "isInFolder",
        }, name = LIST_NAME_CONSTRAINT),
        @UniqueConstraint(columnNames = {
                "orderIndex",
                "spaceId",
                "isInFolder",
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

    @NotNull
    private Boolean isInFolder;

    @NotNull
    private Integer statusColumnsCategoryId;

    @NotNull
    @JoinColumn(name = "userInfoId")
    @OneToOne(cascade = CascadeType.ALL)
    private UserInfo creator;

    @Builder.Default
    @ManyToMany(mappedBy = "listCategories", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
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
    private Integer taskAmount = 0;

    @Column(updatable = false, insertable = false)
    private Integer parentFolderId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "parentFolderId")
    private FolderCategory folderCategory;

    public void addMember(UserInfo userInfo) {
        members.add(userInfo);
        userInfo.getListCategories().add(this);
    }

    public void removeMember(UserInfo userInfo) {
        members.remove(userInfo);
        userInfo.getListCategories().remove(this);
    }

    public static ListCategory convertFromCreateListDTO(
            CreateListDTO dto, UserInfo userInfo) {
        var isInFolder = dto.folderId() != null ? true : false;

        var listCategory = ListCategory.builder()
                .name(dto.name())
                .creator(userInfo)
                .isInFolder(isInFolder)
                .orderIndex(dto.orderIndex())
                .statusColumnsCategoryId(dto.statusColumnsCategoryId())
                .build();

        listCategory.addMember(userInfo);
        return listCategory;
    }
}
