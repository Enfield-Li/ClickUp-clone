package com.example.userTeam;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.userTeam.dto.CreateNewUserTeamDTO;
import com.example.userTeam.model.UserTeam;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserTeamService {

    private final UserTeamRepository userTeamRepository;

    public List<Integer> getUserJoinedTeamIds(Integer userId) {
        var userTeam = userTeamRepository.findByUserId(userId).orElseThrow();
        return new ArrayList<Integer>(userTeam.getJoinedTeamIds());
    }

    public void joinNewTeam(CreateNewUserTeamDTO createNewUserTeamDTO) {
        var userId = createNewUserTeamDTO.userId();
        var teamId = createNewUserTeamDTO.teamId();

        var isUserExists = userTeamRepository.existsByUserId(userId);
        if (isUserExists) {
            userTeamRepository.updateJoinedTeamId(userId, teamId);
            return;
        }

        var newUserTeam = UserTeam.convertFromCreateNewUserTeamDTO(createNewUserTeamDTO);
        userTeamRepository.save(newUserTeam);
        return;
    }

}
