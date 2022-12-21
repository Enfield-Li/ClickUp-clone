package com.example.panelActivity.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Data;

//To use the @Data annotation you should add the Lombok dependency.
@Data
@Entity
class TeamActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer teamId;

    private Integer listId;

    private Integer spaceIds;

    private Set<Integer> folderIds = new HashSet<>();

}
