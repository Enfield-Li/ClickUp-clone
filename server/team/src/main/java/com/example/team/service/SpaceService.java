package com.example.team.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;

@RestController
public class SpaceService {

    @Autowired
    SpaceRepository spaceRepository;

    // Space createSpace(CreateSpaceDTO createSpaceDTO) {
    // }

}
