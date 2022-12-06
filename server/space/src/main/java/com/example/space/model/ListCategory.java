package com.example.space.model;

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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

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

    @NotNull
    @Builder.Default
    @OneToMany(mappedBy = "folderCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> members = new HashSet<>();

    @NotNull
    @Builder.Default
    @OneToMany(mappedBy = "listCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<StatusColumn> statusColumns = new HashSet<>();
}
