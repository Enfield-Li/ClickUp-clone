package com.example.team.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.team.dto.CreateSpaceDTO;
import com.example.team.model.Space;
import com.example.team.model.Team;
import com.example.team.repository.SpaceRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository repository;

    public Space createSpace(CreateSpaceDTO createSpaceDTO) {

        return null;
    }

}
