package com.example.panelActivity;

import org.springframework.stereotype.Service;

import com.example.clients.jwt.UserInfo;
import com.example.panelActivity.dto.InitPanelActivityDTO;
import com.example.panelActivity.model.PanelActivity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final PanelActivityRepository panelActivityRepository;

    UserInfo userInfo = new UserInfo("mockUser@gmail.com", 1, "mockUser");

    public Boolean createStatusColumn(
            InitPanelActivityDTO createPanelActivityDTO) {
        var userId = userInfo.userId();
        var teamId = createPanelActivityDTO.teamId();
        var spaceId = createPanelActivityDTO.spaceId();
        // validateSpaceId(spaceId);

        var panelActivity = PanelActivity
                .initPanelActivity(userId, teamId, spaceId);
        panelActivityRepository.save(panelActivity);
        return true;
    }

    public PanelActivity getPanelActivity(Integer userId) {
        var panelActivity = panelActivityRepository.findByUserId(userId).orElseThrow();
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
