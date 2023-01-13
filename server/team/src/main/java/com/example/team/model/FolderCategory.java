package com.example.team.model;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.example.clients.jwt.UserCredentials;
import com.example.team.dto.CreateFolderDTO;

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
@EqualsAndHashCode(callSuper = false)
@DiscriminatorValue(value = "FOLDER_CATEGORY")
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "spaceId",
                "orderIndex",
                "CATEGORY_TYPE" })
})
public class FolderCategory extends Category {

    @Builder.Default
    @OneToMany(mappedBy = "folderCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ListCategory> allLists = new HashSet<>();

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

        folderCategory.addMember(userInfo);
        folderCategory.setAllLists(allListCategory);
        return folderCategory;
    }

}
