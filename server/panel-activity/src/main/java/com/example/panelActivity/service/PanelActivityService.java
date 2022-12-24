package com.example.panelActivity.service;

import org.springframework.stereotype.Service;

import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamIdDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.repository.PanelActivityRepository;
import com.example.panelActivity.repository.TeamActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final UserInfo userInfo = new UserInfo(1, "mockUser");
    private final TeamActivityRepository teamActivityRepository;
    private final PanelActivityRepository panelActivityRepository;

    public Boolean updatePanelActivity(
            UpdateDefaultTeamIdDTO createPanelActivityDTO) {
        var userId = userInfo.userId();
        var teamId = createPanelActivityDTO.teamId();
        var spaceId = createPanelActivityDTO.spaceId();
        // validateSpaceId(spaceId);

        // update original
        var exists = panelActivityRepository.existsByUserId(userId);
        if (exists) {
            var rowsAffected = panelActivityRepository.updateDefaultTeamId(userId, teamId);
            var updated = teamActivityRepository.updateOpenedSpaceId(teamId, spaceId);
            return rowsAffected + updated == 2;
        }

        // init
        var panelActivity = PanelActivity
                .initPanelActivity(userId, teamId, spaceId);
        panelActivityRepository.save(panelActivity);
        return true;
    }

    public PanelActivity getPanelActivity(Integer userId) {
        var panelActivity = panelActivityRepository.findByUserId(userId)
                .orElseThrow();
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
