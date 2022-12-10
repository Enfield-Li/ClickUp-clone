package com.example.team.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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
@EqualsAndHashCode(callSuper = false)
@DiscriminatorValue(value = "LIST_CATEGORY")
class ListCategory extends Category {

    private Boolean isSelected;

    @Builder.Default
    private Integer taskAmount = 0;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer folderCategoryId;

    @ManyToOne
    @JoinColumn(name = "folderCategoryId")
    private FolderCategory folderCategory;

}
