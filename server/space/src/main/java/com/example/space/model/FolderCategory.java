package com.example.space.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;

import lombok.AllArgsConstructor;
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
class FolderCategory extends Category {

    private Boolean isOpen;

    @OneToMany(mappedBy = "folderCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ListCategory> allLists;

    @OneToMany(mappedBy = "folderCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> members;
}
