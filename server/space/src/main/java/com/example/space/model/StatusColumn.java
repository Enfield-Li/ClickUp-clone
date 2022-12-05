package com.example.space.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String title;

    private String color;

    @NotNull
    private Integer listId;

    @NotNull
    private Integer orderIndex;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer listCategoryId;

    @ManyToOne
    @JoinColumn(name = "listCategoryId")
    private ListCategory listCategory;
}
