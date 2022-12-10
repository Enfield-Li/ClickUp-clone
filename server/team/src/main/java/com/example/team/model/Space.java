package com.example.team.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
@Entity
class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    @NotNull
    private Boolean isOpen;

    @NotNull
    private Boolean isPrivate;

    @NotNull
    private Integer orderIndex;

    private String color;
    private Boolean isSelected;

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Category> allListOrFolder;

}
