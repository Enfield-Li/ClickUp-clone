package com.example.team.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.repository.SpaceRepository;

@RestController
public class SpaceService {

    @Autowired
    SpaceRepository repository;

    // Space createSpace(CreateSpaceDTO createSpaceDTO) {



    // }

}
