package com.example.space.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
abstract class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    @CreationTimestamp
    private Date createdAt;

    private String color;
    private Boolean isPrivate;

    @JsonIgnore
    @Column(updatable = false, insertable = false)
    private Integer spaceId;

    @NotNull
    @JsonIgnore
    @JoinColumn(name = "spaceId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Space space;
}
