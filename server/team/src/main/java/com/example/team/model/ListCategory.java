package com.example.team.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.example.clients.jwt.UserCredentials;
import com.example.team.dto.CreateListDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.sym.Name;

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
@DiscriminatorValue(value = "LIST_CATEGORY")
@EqualsAndHashCode(callSuper = false, exclude = "folderCategory")
public class ListCategory extends Category {

    @Builder.Default
    private Integer taskAmount = 0;

    @Column(updatable = false, insertable = false)
    private Integer parentFolderId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "parentFolderId")
    private FolderCategory folderCategory;

    public static ListCategory convertFromCreateListDTO(
            CreateListDTO dto, UserInfo userInfo) {
        var listCategory = ListCategory.builder()
                .name(dto.name())
                .creator(userInfo)
                .orderIndex(dto.orderIndex())
                .statusColumnsCategoryId(dto.statusColumnsCategoryId())
                .build();

        listCategory.addMember(userInfo);
        return listCategory;
    }
}
