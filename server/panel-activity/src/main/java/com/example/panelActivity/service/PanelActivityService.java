package com.example.panelActivity.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamIdDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.model.TeamActivity;
import com.example.panelActivity.repository.PanelActivityRepository;
import com.example.panelActivity.repository.TeamActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final TeamActivityRepository teamActivityRepository;
    private final PanelActivityRepository panelActivityRepository;

    @Transactional
    public Boolean updatePanelActivity(
            UpdateDefaultTeamIdDTO createPanelActivityDTO) {
        UserInfo userInfo = new UserInfo(1, "mockUser");
        var userId = userInfo.userId();
        var teamId = createPanelActivityDTO.teamId();
        var spaceId = createPanelActivityDTO.spaceId();
        // validateSpaceId(spaceId);

        // insert new TeamActivity record and update DefaultTeamId
        var exists = panelActivityRepository.existsByUserId(userId);
        if (exists) {
            var panelActivity = panelActivityRepository.findByUserId(userId).orElseThrow();
            var newTeamActivity = TeamActivity.builder()
                    .teamId(teamId)
                    .spaceId(spaceId)
                    .build();
            panelActivity.setDefaultTeamId(teamId);
            panelActivity.getTeamActivities().add(newTeamActivity);
            return true;
        }

        // init
        var panelActivity = PanelActivity
                .initPanelActivity(userId, teamId, spaceId);
        panelActivityRepository.save(panelActivity);
        return true;
    }

    public PanelActivity getPanelActivity(Integer userId) {
        var panelActivity = panelActivityRepository.findByUserId(userId)
                .orElseThrow(() -> new Error("User does not exist!"));
        validatePanelActivity(panelActivity);
        return panelActivity;
    }

    private void validatePanelActivity(PanelActivity panelActivity) {
        panelActivity.getTeamActivities().stream()
                .filter(teamActivity -> teamActivity.getTeamId()
                        .equals(panelActivity.getDefaultTeamId()))
                .findAny()
                .orElseThrow();
    }

    private void validateSpaceId(Integer spaceId) {
        // check validity
    }

}
