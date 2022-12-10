package com.example.statusColumn.model;

import static javax.persistence.FetchType.LAZY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;

    @NotNull
    private String email;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer folderCategoryId;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "folderCategoryId")
    private FolderCategory folderCategory;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer listCategoryId;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "listCategoryId")
    private ListCategory listCategory;
}
