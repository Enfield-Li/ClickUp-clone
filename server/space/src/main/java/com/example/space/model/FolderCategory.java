package com.example.space.model;

import java.util.Set;

import javax.persistence.CascadeType;
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
// https://stackoverflow.com/questions/31664098/lombok-builder-inheritance-workaround
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
class FolderCategory extends Category {

    private Boolean isOpen;

    @OneToMany(mappedBy = "folderCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ListCategory> allLists;

    @OneToMany(mappedBy = "folderCategory", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<UserInfo> members;
}
