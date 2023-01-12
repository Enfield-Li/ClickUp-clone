package com.example.team.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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
@EqualsAndHashCode(callSuper = false)
@DiscriminatorValue(value = "LIST_CATEGORY")
public class ListCategory extends Category {

    @Builder.Default
    private Integer taskAmount = 0;

    @Column(updatable = false, insertable = false)
    private Integer parentFolderId;

    @ManyToOne
    @JoinColumn(name = "parentFolderId")
    private FolderCategory folderCategory;

    public static ListCategory convertFromCreateListDTO(
        CreateListDTO dto, FolderCategory folderCategory) {
        return ListCategory.builder()
                .name(dto.name())
                .folderCategory(folderCategory)
                .statusColumnsCategoryId(dto.statusCategoryId())
                .build();
    }
}
