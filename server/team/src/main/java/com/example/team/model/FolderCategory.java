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

import com.example.team.dto.CreateFolderDTO;

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
public class FolderCategory extends Category {

    @OneToMany(mappedBy = "folderCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<ListCategory> allLists = new HashSet<>();

    public static FolderCategory convertFromCreateFolderDTO(
            CreateFolderDTO dto) {
        var folderCategory = FolderCategory.builder().build();
        Set<ListCategory> allListCategory = dto.allListNames().stream()
                .map(name -> ListCategory.builder()
                        .folderCategory(folderCategory).name(name).build())
                .collect(Collectors.toSet());

        folderCategory.setAllLists(allListCategory);
        return folderCategory;
    }

}
